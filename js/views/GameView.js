class GameView {
    constructor(gameModel) {
        this.gameModel = gameModel;
        this.ctx = gameModel.ctx;
    }

    clearScreen() {
        this.ctx.clearRect(0, 0, this.gameModel.canvas.width, this.gameModel.canvas.height);
    }

    render() {
        this.clearScreen();

        if (this.gameModel.gameOver) {
            this.showGameOver();
            return;
        }

        if (this.gameModel.victory) {
            this.showVictory();
            return;
        }

        if (this.gameModel.player) {
            this.gameModel.player.draw(this.ctx);
        }

        for (let enemy of this.gameModel.enemies) {
            if (enemy && enemy.alive) {
                enemy.draw(this.ctx);
            }
        }

        for (let bullet of this.gameModel.playerBullets) {
            if (bullet) {
                bullet.draw(this.ctx);
            }
        }

        for (let bullet of this.gameModel.enemyBullets) {
            if (bullet) {
                bullet.draw(this.ctx);
            }
        }

        this.ctx.save();
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 20px Courier";
        this.ctx.fillText("SCORE: " + this.gameModel.score, 10, 20);
        this.ctx.restore();
    }

    showGameOver() {
        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.gameModel.canvas.width, this.gameModel.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 60px Courier";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Game Over", this.gameModel.canvas.width / 2, 150);
        this.ctx.font = "bold 40px Courier";
        this.ctx.fillText("Puntuación: " + this.gameModel.score, this.gameModel.canvas.width / 2, 220);
        this.ctx.restore();

        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = (this.gameModel.canvas.width - buttonWidth) / 2;
        const buttonY = 300;

        this.ctx.save();
        this.ctx.fillStyle = "#0f0";
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        this.ctx.fillStyle = "#000";
        this.ctx.font = "bold 20px Courier";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("RESTART GAME", this.gameModel.canvas.width / 2, buttonY + buttonHeight / 2);
        this.ctx.restore();
    }

    showVictory() {
        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.gameModel.canvas.width, this.gameModel.canvas.height);
        this.ctx.fillStyle = "gold";
        this.ctx.font = "bold 60px Courier";
        this.ctx.textAlign = "center";
        this.ctx.fillText("¡Victoria!", this.gameModel.canvas.width / 2, 150);
        this.ctx.font = "bold 40px Courier";
        this.ctx.fillText("Puntuación: " + this.gameModel.score, this.gameModel.canvas.width / 2, 220);
        this.ctx.restore();

        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = (this.gameModel.canvas.width - buttonWidth) / 2;
        const buttonY = 300;

        this.ctx.save();
        this.ctx.fillStyle = "#0f0";
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        this.ctx.fillStyle = "#000";
        this.ctx.font = "bold 20px Courier";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("RESTART GAME", this.gameModel.canvas.width / 2, buttonY + buttonHeight / 2);
        this.ctx.restore();
    }
}