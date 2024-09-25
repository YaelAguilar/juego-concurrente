class Bullet {
    constructor(x, y, width, height, color, speedY) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speedY = speedY;
    }

    update() {
        this.y += this.speedY;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}