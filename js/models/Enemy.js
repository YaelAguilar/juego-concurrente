class Enemy {
    constructor(x, y, width, height, image, dx, num, figure) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.dx = dx;
        this.num = num;
        this.veces = 0;
        this.ciclos = 0;
        this.figure = figure;
        this.alive = true;
    }

    update() {
        if (this.ciclos > 30) {
            if (this.veces > this.num) {
                this.dx *= -1;
                this.veces = 0;
                this.num = 28;
                this.y += 20;
                this.dx = (this.dx > 0) ? this.dx + 1 : this.dx - 1;
            } else {
                this.x += this.dx;
            }
            this.veces++;
            this.ciclos = 0;
            this.figure = !this.figure;
        } else {
            this.ciclos++;
        }
    }

    draw(ctx) {
        if (this.figure) {
            ctx.drawImage(this.image, 0, 0, 40, 30, this.x, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.image, 50, 0, 35, 30, this.x, this.y, this.width, this.height);
        }
    }
}