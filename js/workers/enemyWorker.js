onmessage = (e) => {
    let { enemigos } = e.data;

    enemigos.forEach(enemigo => {
        if (enemigo != null && enemigo.alive) {
            if (enemigo.ciclos > 30) {
                if (enemigo.veces > enemigo.num) {
                    enemigo.dx *= -1;
                    enemigo.veces = 0;
                    enemigo.num = 28;
                    enemigo.y += 20;
                    enemigo.dx = (enemigo.dx > 0) ? enemigo.dx + 1 : enemigo.dx - 1;
                } else {
                    enemigo.x += enemigo.dx;
                }
                enemigo.veces++;
                enemigo.ciclos = 0;
                enemigo.figure = !enemigo.figure;
            } else {
                enemigo.ciclos++;
            }
        }
    });

    postMessage(enemigos);
};