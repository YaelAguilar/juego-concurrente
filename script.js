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

animateTitle();

const menuItems = document.querySelectorAll('.menu-item');
let selectedItem = null;

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        if (selectedItem) {
            selectedItem.classList.remove('selected');
            selectedItem.textContent = selectedItem.textContent.replace(' <', '');
        }
        item.classList.add('selected');
        item.textContent += ' <';
        selectedItem = item;

    });
});

setInterval(() => {
    if (selectedItem) {
        selectedItem.style.visibility = selectedItem.style.visibility === 'hidden' ? 'visible' : 'hidden';
    }
}, 500);

for (let i = 0; i < 50; i++) {
    const star = document.createElement('div');
    star.classList.add('stars');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.opacity = Math.random();
    document.body.appendChild(star);
}