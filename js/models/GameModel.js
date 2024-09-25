class GameModel {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.player = null;
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];

        this.score = 0;
        this.gameOver = false;
        this.victory = false;
        this.disparo = false;

        this.boing = document.getElementById("boing");
        this.disparoJugador = document.getElementById("disparo");
        this.intro = document.getElementById("intro");
        this.fin = document.getElementById("fin");
        this.winSound = document.getElementById("victory");

        this.keys = {};

        this.playerImage = new Image();
        this.playerImage.src = "assets/imagenes/torre.fw.png";

        this.enemyImage = new Image();
        this.enemyImage.src = "assets/imagenes/invader.fw.png";
    }

    init() {
        this.player = new Player(
            this.canvas.width / 2 - 15,
            this.canvas.height - 90,
            30,
            15,
            this.playerImage
        );

        this.enemies = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 10; j++) {
                let enemy = new Enemy(
                    100 + 40 * j,
                    30 + 45 * i,
                    35,
                    30,
                    this.enemyImage,
                    5,
                    14,
                    true
                );
                this.enemies.push(enemy);
            }
        }
    }
}
