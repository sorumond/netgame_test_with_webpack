import { SpaceShip } from "./spaceShip";

export default class Player extends SpaceShip {
    constructor({ app, texture, health }) {
        super({ app, texture, health })
        this.defaultBooletCount = 10;
        this.bulletSpeed = -9;
        this.remainBoolets = this.defaultBooletCount;

        this.unit.width = 100;
        this.unit.height = 200;
        this.unit.y = this.app.canvas.height - this.unit.height / 2;
        this.defaultPosition = this.app.canvas.width / 2;
        this.unit.x = this.defaultPosition;
        this.bulletSpawnPoint = { x: this.unit.x, y: this.unit.y - this.unit.height / 2 };
        this.bulletSpawnModifier = { x: 0, y: 0 - this.unit.height / 2 }
    }

    shoot() {
        super.shoot();
        this.remainBoolets -= 1;
    }

    destroy() {
        this.app.gameEnd(false);
    }

    reset() {
        super.reset();
        this.remainBoolets = this.defaultBooletCount;
    }
}