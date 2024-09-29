import Bullet from "./bullet";
import Unit from "./unit";


export class SpaceShip extends Unit {
    constructor({ app, texture, health }) {
        super({ app, texture, health });
        this.bullets = [];
        this.speed = 15;
        this.unit.anchor.set(0.5);
        this.bulletSpawnModifier = { x: 0, y: 0 };
        this.bullerColor = 0xFFFF00;
    }

    moveLeft(speed) {
        const { } = this;
        if (this.x - speed - this.width / 2 >= 0) {
            this.x -= speed;
        }
    }

    moveRight(speed) {
        const { app } = this;
        if (this.x + this.width / 2 + speed < app.screen.width) {
            this.x += speed;
        }
    }

    shoot() {
        const { bullets, app } = this;
        const bullet = new Bullet({ speed: this.bulletSpeed, spawnPoint: { x: this.x + this.bulletSpawnModifier.x, y: this.y + this.bulletSpawnModifier.y }, app, bulletColor: this.bullerColor })
        bullets.push(bullet);
    }

    updateBoolets(speed) {
        const { bullets } = this;

        bullets.forEach((bullet, index) => {
            if (index === 1) {
                bullet.y;
            }
            bullet.updateBullet(speed);
            if (bullet.y < 0 || bullet.y > this.app.screen.height) {
                this.bullets.splice(index, 1);
                this.destroyBullet(bullet);
            }
        });
    }

    reset() {
        super.reset();
        this.x = this.defaultPosition;

        this.bullets.forEach((bullet, index) => {
            this.destroyBullet(bullet, index);
            this.app.stage.removeChild(bullet);
            bullet.destroy()
        });
        this.bullets = [];
    }

    destroyBullet(item) {
        item.destroy();
    }
}