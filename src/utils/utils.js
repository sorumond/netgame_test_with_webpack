export function hitCheck({ bullets, targets }) {
    for (let bulletIndex = 0; bulletIndex < bullets.length; bulletIndex++) {
        for (let targetIndex = 0; targetIndex < targets.length; targetIndex++) {
            const bullet = bullets[bulletIndex];
            const target = targets[targetIndex];

            const bounds1 = bullet.getBounds;
            const bounds2 = target.getBounds;

            const isHit = (
                bounds1.x < bounds2.x + bounds2.width
                && bounds1.x + bounds1.width > bounds2.x
                && bounds1.y < bounds2.y + bounds2.height
                && bounds1.y + bounds1.height > bounds2.y
            );
            if (isHit) {
                bullets.splice(bulletIndex, 1);
                bullet.destroy(bulletIndex);
                target.hit(1);
                if (target.health === 0) {
                    target.destroy(targetIndex);
                    targets.splice(targetIndex, 1);
                }
                break;
            }
        }
    }
};

export function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}