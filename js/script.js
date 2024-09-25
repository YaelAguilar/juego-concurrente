const title = document.getElementById('title');
let direction = 1;
let position = 0;

function animateTitle() {
    position += direction * 0.5;
    if (position > 5 || position < -5) {
        direction *= -1;
    }
    title.style.transform = `translateY(${position}px)`;
    requestAnimationFrame(animateTitle);
}

function startGame(menuContainer, canvasContainer, gameController) {
    let opacity = 1;
    const fadeEffect = setInterval(() => {
        if (opacity > 0) {
            opacity -= 0.1;
            menuContainer.style.opacity = opacity;
        } else {
            clearInterval(fadeEffect);
            menuContainer.classList.add('hidden');
            canvasContainer.classList.remove('hidden');
            gameController.update();
        }
    }, 50);
}