onmessage = (e) => {
    let { playerBullets, enemyBullets, canvasHeight } = e.data;

    playerBullets = playerBullets.filter(bullet => bullet !== null && bullet.y >= 0);
    playerBullets.forEach(bullet => {
        bullet.y += bullet.speedY;
    });

    enemyBullets = enemyBullets.filter(bullet => bullet !== null && bullet.y <= canvasHeight);
    enemyBullets.forEach(bullet => {
        bullet.y += bullet.speedY;
    });

    postMessage({
        playerBullets: playerBullets,
        enemyBullets: enemyBullets
    });
};