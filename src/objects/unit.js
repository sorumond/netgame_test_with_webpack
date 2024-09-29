import { Sprite } from "pixi.js";

export default class Unit {
    constructor({ app, texture, health = 1 }) {
        this.app = app;
        this.defaultHealth = health;
        this.health = this.defaultHealth;
        this.unit = new Sprite(texture);
    };

    spawn() {
        this.app.stage.addChild(this.unit);
    }

    get x() {
        return this.unit.x;
    }

    get y() {
        return this.unit.y;
    }

    set x(value) {
        this.unit.x = value;
    }

    set y(value) {
        this.unit.y = value;
    }

    get width() {
        return this.unit.width;
    }

    get height() {
        return this.unit.height;
    }

    get getBounds() {
        return this.unit.getBounds();
    }

    hit(damage) {
        this.health -= damage;
    }

    reset() {
        this.health = this.defaultHealth;
    }

    destroy() {
        this.app.stage.removeChild(this.unit);
    }
}