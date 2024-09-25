document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const gameModel = new GameModel(canvas);
    gameModel.init();

    const gameView = new GameView(gameModel);
    const gameController = new GameController(gameModel, gameView);

    animateTitle();

    const startButton = document.getElementById('start-button');
    const menuContainer = document.getElementById('menu-container');
    const canvasContainer = document.getElementById('canvas-container');

    startButton.addEventListener('click', () => {
        startGame(menuContainer, canvasContainer, gameController);
    });
});