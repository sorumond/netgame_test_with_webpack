import { Application, Graphics, Text, Sprite, Assets, Container } from "pixi.js";

import { initDevtools } from "@pixi/devtools";
import Player from "./objects/player";
import Asteroid from "./objects/asteroid";
import { hitCheck } from "./utils/utils";
import Boss from "./objects/boss";
import backgroundImage from './images/background.jpg';
import playerImage from './images/player.png';
import bossImage from './images/boss.png';
import asteroidImage from './images/asteroid.webp';

(async () => {
    const app = new Application();

    app.someRandomShit = 5;

    await app.init({
        width: 1280,
        height: 720
    });

    initDevtools({ app });

    app.canvas.style.position = 'absolute';

    let isGameStarted = false;
    let level = 1;

    const canvasBackgroundTexture = await Assets.load(backgroundImage);
    const canvasBackground = new Sprite(canvasBackgroundTexture);
    canvasBackground.width = app.canvas.width;
    canvasBackground.height = app.canvas.height;

    app.stage.addChild(canvasBackground);

    const texture = await Assets.load(playerImage);
    const player = new Player({ app, texture });
    player.spawn();

    const bossTexture = await Assets.load(bossImage);
    const boss = new Boss({ app, texture: bossTexture, health: 4 });
    boss.spawn();
    boss.visible = false;

    const asteroidTexture = await Assets.load(asteroidImage);
    let asteroids = [];
    function spawnAsteroids() {
        for (let i = 0; i < 5; i++) {
            const asteroid = new Asteroid({ app, texture: asteroidTexture });
            asteroids.push(asteroid);
            asteroid.spawn();
        }
    }

    function createLabel(label) {
        const text = new Text({
            text: label,
            style: {
                fill: 0xFFFFFF,
                fontSize: 72
            }
        });
        text.x = app.screen.width / 2;
        text.y = 35;
        text.anchor.set(0.5, 0);
        return text;
    }
    const centalLabel = createLabel('');
    app.stage.addChild(centalLabel);
    centalLabel.visible = false;


    const bulletsCounterText = new Text({
        text: `Bullets: ${player.remainBoolets}/${player.defaultBooletCount}`,
        style: {
            fill: 'red',
            fontSize: 36,
            fontWeight: 'bold'
        }
    })
    app.stage.addChild(bulletsCounterText);


    const timerText = new Text({
        text: 0,
        style: {
            fill: 'red',
            fontSize: 52,
            fontWeight: 'bold'
        }
    })
    timerText.anchor.set(1, 0);
    timerText.position.set(app.screen.width, 0);
    app.stage.addChild(timerText);

    let defaultTimer = 60;
    let timer = defaultTimer;
    let timerID = 0;
    function startTimer() {
        return setInterval(() => {
            timer--;
            timerText.text = timer;
            if (timer == 0) {
                gameEnd(false);
            }
        }, 1000);
    }

    function stopTimer() {
        timer = defaultTimer;
        clearInterval(timerID)

    }
    const buttonStartContainer = new Container();
    const buttonStart = new Graphics();
    const someText = new Text({
        text: 'Press to start',
        style: {
            fontSize: 48,
            fill: 'red',
            fontWeight: 'bold'
        }
    });
    buttonStartContainer.addChild(someText);
    someText.zIndex = 2;
    buttonStart.roundRect(0, 0, buttonStartContainer.width, buttonStartContainer.height, 10);
    buttonStart.fill('white');
    someText.position.set(buttonStartContainer.width / 2 - someText.width / 2, 0);
    buttonStart.stroke({
        width: 3,
        color: 0x0000FF
    })
    buttonStart.eventMode = 'static';
    buttonStart.on('click', () => {
        gameStart();
    });
    buttonStart.cursor = 'pointer';
    buttonStartContainer.position.set(app.screen.width / 2 - buttonStart.width / 2, app.screen.height / 2);

    buttonStartContainer.addChild(buttonStart);
    app.stage.addChild(buttonStartContainer);

    let leftPressed = false;
    let rightPressed = false;
    document.addEventListener('keydown', (e) => {
        if (!isGameStarted)
            return;

        if (e.key === 'ArrowRight') {
            rightPressed = true;
        }
        if (e.key === 'ArrowLeft') {
            leftPressed = true;
        }
        if (e.code === 'Space') {
            if (player.remainBoolets !== 0) {
                player.shoot();
                bulletsCounterText.text = `Bullets: ${player.remainBoolets} / ${player.defaultBooletCount}`;
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowRight') {
            rightPressed = false;
        }
        if (e.key === 'ArrowLeft') {
            leftPressed = false;
        }
    });

    app.ticker.add((delta) => {
        if (!isGameStarted)
            return;

        player.updateBoolets(player.bulletSpeed * delta.deltaTime);
        boss.updateBoolets(boss.bulletSpeed * delta.deltaTime);
        if (leftPressed) {
            player.moveLeft(player.speed * delta.deltaTime);
        }
        if (rightPressed) {
            player.moveRight(player.speed * delta.deltaTime);
        }

        switch (level) {
            case 1:
                hitCheck({ bullets: player.bullets, targets: asteroids, app: app });
                if (asteroids.length === 0 && timer > 0) {
                    setLevelTwo();
                }

                if (asteroids.length > 0 && player.remainBoolets == 0 && player.bullets.length == 0) {
                    gameEnd(false);
                }
                break;
            case 2:
                hitCheck({ bullets: player.bullets, targets: boss.bullets }, app);
                hitCheck({ bullets: player.bullets, targets: [boss] }, app);
                hitCheck({ bullets: boss.bullets, targets: [player], app });
                boss.updatePosition(boss.speed * delta.deltaTime);
                if (player.remainBoolets == 0 && player.bullets.length == 0) {
                    gameEnd(false);
                }
                break;
            default:
                gameEnd(false);
                break;
        }
    });

    function gameStart() {
        isGameStarted = true;
        timerText.text = timer;
        centalLabel.visible = false;
        spawnAsteroids();
        buttonStartContainer.visible = false;
        timerID = startTimer();
        bulletsCounterText.text = `Bullets: ${player.remainBoolets} / ${player.defaultBooletCount}`;
    }

    function gameEnd(isWin) {
        centalLabel.text = isWin ? 'YOU WIN!' : 'YOU LOSE!';
        centalLabel.visible = true;
        reset();
    }

    app.gameEnd = gameEnd;

    function setLevelTwo() {
        level = 2;
        timer = defaultTimer;
        player.remainBoolets = player.defaultBooletCount;
        bulletsCounterText.text = `Bullets: ${player.remainBoolets} / ${player.defaultBooletCount}`;
        boss.visible = true;
        boss.startShooting();
        boss.movement();
    }

    function reset() {
        boss.visible = false;
        level = 1;
        player.reset();
        boss.reset();
        stopTimer();
        buttonStartContainer.visible = true;
        isGameStarted = false;

        asteroids.forEach((item) => {
            item.destroy();
        });
        asteroids = [];
    }

    document.body.appendChild(app.canvas);
})();