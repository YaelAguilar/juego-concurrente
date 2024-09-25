class GameController {
    constructor(gameModel, gameView) {
        this.gameModel = gameModel;
        this.gameView = gameView;
        this.animationFrameId = null;
        this.initEventListeners();

        this.bulletWorker = null;
        this.enemyWorker = null;
        this.collisionWorker = null;

        this.initWorkers();
    }

    initEventListeners() {
        // Eventos de teclado
        document.addEventListener("keydown", (e) => {
            this.gameModel.keys[e.keyCode] = true;
        });

        document.addEventListener("keyup", (e) => {
            this.gameModel.keys[e.keyCode] = false;
        });

        this.gameModel.canvas.addEventListener("click", (event) => this.onCanvasClick(event));
    }

    onCanvasClick(event) {
        if (this.gameModel.gameOver || this.gameModel.victory) {
            const rect = this.gameModel.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const buttonWidth = 200;
            const buttonHeight = 50;
            const buttonX = (this.gameModel.canvas.width - buttonWidth) / 2;
            const buttonY = 300;

            if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
                this.restartGame();
            }
        }
    }

    initWorkers() {
        if (typeof Worker !== "undefined") {
            if (this.bulletWorker) this.bulletWorker.terminate();
            if (this.enemyWorker) this.enemyWorker.terminate();
            if (this.collisionWorker) this.collisionWorker.terminate();

            this.bulletWorker = new Worker("js/workers/bulletWorker.js");
            this.bulletWorker.onmessage = (e) => {
                this.gameModel.playerBullets = e.data.playerBullets.map(data => {
                    if (data !== null) {
                        return new Bullet(data.x, data.y, data.width, data.height, data.color, data.speedY);
                    } else {
                        return null;
                    }
                });

                this.gameModel.enemyBullets = e.data.enemyBullets.map(data => {
                    if (data !== null) {
                        return new Bullet(data.x, data.y, data.width, data.height, data.color, data.speedY);
                    } else {
                        return null;
                    }
                });
            };

            this.enemyWorker = new Worker("js/workers/enemyWorker.js");
            this.enemyWorker.onmessage = (e) => {
                e.data.forEach((data, index) => {
                    if (data !== null && this.gameModel.enemies[index]) {
                        let enemy = this.gameModel.enemies[index];
                        enemy.x = data.x;
                        enemy.y = data.y;
                        enemy.dx = data.dx;
                        enemy.num = data.num;
                        enemy.veces = data.veces;
                        enemy.ciclos = data.ciclos;
                        enemy.figure = data.figure;
                        enemy.alive = data.alive;
                    }
                });
            };

            this.collisionWorker = new Worker("js/workers/collisionWorker.js");
            this.collisionWorker.onmessage = (e) => {
                let collisions = e.data;
                collisions.forEach(collision => {
                    if (collision.type === 'enemyHit') {
                        const enemyIndex = collision.enemyIndex;
                        const bulletIndex = collision.bulletIndex;
                        if (this.gameModel.enemies[enemyIndex]) {
                            this.gameModel.enemies[enemyIndex].alive = false;
                            this.gameModel.playerBullets[bulletIndex] = null;
                            this.gameModel.disparo = false;
                            this.gameModel.score += 10;
                            this.gameModel.boing.play();
                        }
                    } else if (collision.type === 'playerHit') {
                        this.gameOver();
                    }
                });
            };
        } else {
            alert("Tu navegador no soporta Web Workers.");
        }
    }

    update() {
        if (!this.gameModel.gameOver && !this.gameModel.victory) {
            this.animationFrameId = requestAnimationFrame(() => this.update());

            this.processInput();
            this.sendDataToWorkers();
            this.gameView.render();

            let aliveEnemies = this.gameModel.enemies.filter(e => e && e.alive);
            if (aliveEnemies.length === 0) {
                this.victory();
            }
        }
    }

    processInput() {
        const KEY_LEFT = 37;
        const KEY_RIGHT = 39;
        const KEY_SPACE = 32;

        if (this.gameModel.keys[KEY_RIGHT]) this.gameModel.player.move(10);
        if (this.gameModel.keys[KEY_LEFT]) this.gameModel.player.move(-10);

        if (this.gameModel.player.x > this.gameModel.canvas.width - this.gameModel.player.width) {
            this.gameModel.player.x = this.gameModel.canvas.width - this.gameModel.player.width;
        }
        if (this.gameModel.player.x < 0) this.gameModel.player.x = 0;

        if (this.gameModel.keys[KEY_SPACE] && !this.gameModel.disparo) {
            const bullet = new Bullet(
                this.gameModel.player.x + this.gameModel.player.width / 2 - 2,
                this.gameModel.player.y - 5,
                5,
                5,
                'red',
                -4
            );
            this.gameModel.playerBullets.push(bullet);
            this.gameModel.keys[KEY_SPACE] = false;
            this.gameModel.disparo = true;
            this.gameModel.disparoJugador.play();
        }

        if (this.gameModel.playerBullets.filter(b => b !== null).length === 0) {
            this.gameModel.disparo = false;
        }

        if (Math.random() > 0.96) {
            this.enemyShoot();
        }
    }

    enemyShoot() {
        let aliveEnemies = this.gameModel.enemies.filter(e => e && e.alive);
        if (aliveEnemies.length > 0) {
            let randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
            let bullet = new Bullet(
                randomEnemy.x + randomEnemy.width / 2 - 2,
                randomEnemy.y + randomEnemy.height,
                5,
                5,
                'yellow',
                6
            );
            this.gameModel.enemyBullets.push(bullet);
        }
    }

    sendDataToWorkers() {
        const serializableEnemies = this.gameModel.enemies.map(enemy => {
            if (enemy) {
                return {
                    x: enemy.x,
                    y: enemy.y,
                    width: enemy.width,
                    height: enemy.height,
                    dx: enemy.dx,
                    num: enemy.num,
                    veces: enemy.veces,
                    ciclos: enemy.ciclos,
                    figure: enemy.figure,
                    alive: enemy.alive
                };
            } else {
                return null;
            }
        });

        const serializablePlayerBullets = this.gameModel.playerBullets.map(bullet => {
            if (bullet) {
                return {
                    x: bullet.x,
                    y: bullet.y,
                    width: bullet.width,
                    height: bullet.height,
                    speedY: bullet.speedY,
                    color: bullet.color
                };
            } else {
                return null;
            }
        });

        const serializableEnemyBullets = this.gameModel.enemyBullets.map(bullet => {
            if (bullet) {
                return {
                    x: bullet.x,
                    y: bullet.y,
                    width: bullet.width,
                    height: bullet.height,
                    speedY: bullet.speedY,
                    color: bullet.color
                };
            } else {
                return null;
            }
        });

        this.enemyWorker.postMessage({ enemigos: serializableEnemies });

        this.bulletWorker.postMessage({
            playerBullets: serializablePlayerBullets,
            enemyBullets: serializableEnemyBullets,
            canvasHeight: this.gameModel.canvas.height
        });

        this.collisionWorker.postMessage({
            playerBullets: serializablePlayerBullets,
            enemyBullets: serializableEnemyBullets,
            enemies: serializableEnemies,
            player: {
                x: this.gameModel.player.x,
                y: this.gameModel.player.y,
                width: this.gameModel.player.width,
                height: this.gameModel.player.height
            }
        });
    }

    gameOver() {
        this.gameModel.gameOver = true;
        this.gameModel.fin.play();
        cancelAnimationFrame(this.animationFrameId);
        this.gameView.render();
    }

    victory() {
        this.gameModel.victory = true;
        this.gameModel.winSound.play();
        cancelAnimationFrame(this.animationFrameId);
        this.gameView.render();
    }

    restartGame() {
        this.gameModel.gameOver = false;
        this.gameModel.victory = false;
        this.gameModel.score = 0;
        this.gameModel.enemies = [];
        this.gameModel.playerBullets = [];
        this.gameModel.enemyBullets = [];
        this.gameModel.keys = {};
        this.gameModel.disparo = false;

        this.gameModel.init();

        this.initWorkers();
        this.update();
    }
}