import Unit from "./unit";
import { randomIntFromInterval } from "../utils/utils";

export default class Asteroid extends Unit {
    constructor({ app, texture }) {
        super({ app, texture });
        this.unit.width = 150;
        this.unit.height = 150;
        this.randomizePosition();
        this.unit.anchor.set(0.5);
    }

    get hitDistance() {
        return this.unit.width / 2;
    }

    randomizePosition() {
        const { app, unit } = this;
        this.x = randomIntFromInterval(unit.width / 2, app.screen.width - unit.width / 2);;
        this.y = randomIntFromInterval(unit.height / 2, app.screen.height - unit.height / 2 - 200);;
    }
}
