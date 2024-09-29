import { Container, Graphics } from "pixi.js";
import { randomIntFromInterval } from "../utils/utils";
import { SpaceShip } from "./spaceShip";

export default class Boss extends SpaceShip {
    constructor({ app, texture, health }) {
        super({ app, texture, health })

        this.bossContainer = new Container();

        this.bulletSpeed = 6;
        this.unit.width = 200;
        this.unit.height = 200;
        this.unit.anchor.set(0);
        this.defaultPosition = this.app.canvas.width / 2 - this.unit.width / 2;
        this.newPoint = this.defaultPosition;
        this.x = this.defaultPosition;
        this.bulletSpawnModifier = { x: this.unit.width / 2, y: this.unit.height }
        this.bullerColor = 0xff0000;
        this.chillTimeout = 0;
        this.shootingInterval = 0;
        this.chill = false;


        this.healthBarBackground = new Graphics();
        this.healthBarBackground.rect(0, 0, this.unit.width, 25);
        this.healthBarBackground.fill('white');
        this.healthBarBackground.position.set(0, 0);
        this.healthBar = new Graphics();
        this.healthBar.rect(0, 0, this.healthBarBackground.width, this.healthBarBackground.height).fill('green');
    }

    spawn() {
        this.bossContainer.addChild(this.unit);
        this.bossContainer.addChild(this.healthBarBackground);
        this.bossContainer.addChild(this.healthBar)
        this.app.stage.addChild(this.bossContainer);
    }

    movement = () => {
        this.newPoint = Math.floor(randomIntFromInterval(this.unit.width / 2, this.app.screen.width - this.unit.width / 2));
        this.chill = false;
        this.speed = randomIntFromInterval(5, 10);
    }

    updatePosition = (speed) => {
        const difference = this.x - this.newPoint;
        if (!this.chill) {

            if (Math.abs(difference) > this.speed) {
                if (difference > 0) {
                    this.moveLeft(speed);
                } else {
                    this.moveRight(speed);
                }
            } else {
                this.chill = true;
                this.chillTimeout = setTimeout(() => {
                    this.movement();
                }, randomIntFromInterval(2, 4) * 1000);
            }
        }
    }

    startShooting() {
        this.shootingInterval = window.setInterval(() => {
            this.shoot();
        }, 2000);
    }

    hit(damage) {
        super.hit(damage);
        this.healthBar.width = this.health / this.defaultHealth * this.healthBarBackground.width;
    }

    reset() {
        super.reset();
        window.clearInterval(this.shootingInterval);
        clearTimeout(this.chillTimeout);
        this.healthBar.width = this.unit.width;
    }

    destroy() {
        this.app.gameEnd(true);
    }

    get x() {
        return this.bossContainer.x;
    }

    get y() {
        return this.bossContainer.y;
    }

    set x(value) {
        this.bossContainer.x = value;
    }

    set y(value) {
        this.bossContainer.y = value;
    }

    set visible(value) {
        this.bossContainer.visible = value;
    }

    get visible() {
        return this.bossContainer.visible;
    }
}