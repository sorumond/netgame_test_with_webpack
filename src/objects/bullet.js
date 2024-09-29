import { Graphics } from "pixi.js";

export default class Bullet {
    constructor({ speed, spawnPoint, bulletColor, app }) {
        this.bullet = new Graphics();
        this.speed = speed;
        this.radius = 10;
        this.app = app;
        this.health = 1;
        this.bullet.circle(
            0,
            0,
            this.radius
        )
            .fill({
                color: bulletColor
            })
        this.bullet.position.set(spawnPoint.x, spawnPoint.y);
        this.bullet.interactive = true;
        this.app.stage.addChild(this.bullet);
    }

    updateBullet(speed) {
        this.bullet.y = this.bullet.y + speed;
    }

    hit(damage) {
        this.health -= damage;
    }

    get y() {
        return this.bullet.y;
    }

    get x() {
        return this.bullet.x;
    }

    get hitDistance() {
        return this.radius;
    }

    get getBounds() {
        return this.bullet.getBounds();
    }

    destroy() {
        this.app.stage.removeChild(this.bullet);
        this.bullet.destroy()
    }
}