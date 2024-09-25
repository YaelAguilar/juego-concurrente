onmessage = (e) => {
    let { playerBullets, enemyBullets, enemies, player } = e.data;
    let collisions = [];

    // Detectar colisiones entre balas del jugador y enemigos
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (enemy && enemy.alive) {
            for (let j = 0; j < playerBullets.length; j++) {
                let bullet = playerBullets[j];
                if (bullet) {
                    if (bullet.x + bullet.width > enemy.x && bullet.x < enemy.x + enemy.width &&
                        bullet.y + bullet.height > enemy.y && bullet.y < enemy.y + enemy.height) {
                        collisions.push({ type: 'enemyHit', enemyIndex: i, bulletIndex: j });
                    }
                }
            }
        }
    }

    // Detectar colisiones entre balas enemigas y jugador
    for (let j = 0; j < enemyBullets.length; j++) {
        let bullet = enemyBullets[j];
        if (bullet) {
            if (bullet.x + bullet.width > player.x && bullet.x < player.x + player.width &&
                bullet.y + bullet.height > player.y && bullet.y < player.y + player.height) {
                collisions.push({ type: 'playerHit', bulletIndex: j });
            }
        }
    }

    postMessage(collisions);
};