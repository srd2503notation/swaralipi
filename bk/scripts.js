// Make palette box movable
document.addEventListener('DOMContentLoaded', (event) => {
    const paletteBox = document.getElementById('palette-box');
    let isDragging = false;
    let offsetX, offsetY;

    paletteBox.addEventListener('mousedown', (e) => {
        if (e.target === paletteBox || e.target.className === 'palette-box-header') {
            isDragging = true;
            offsetX = e.clientX - paletteBox.offsetLeft;
            offsetY = e.clientY - paletteBox.offsetTop;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // Boundary checks to prevent moving out of the screen
            const maxWidth = window.innerWidth - paletteBox.offsetWidth;
            const maxHeight = window.innerHeight - paletteBox.offsetHeight;

            newX = Math.max(0, Math.min(newX, maxWidth));
            newY = Math.max(0, Math.min(newY, maxHeight));

            paletteBox.style.left = `${newX}px`;
            paletteBox.style.top = `${newY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});

function toggleSection(element) {
    const buttons = element.nextElementSibling;
    const arrow = element.querySelector('.arrow');
    if (buttons.style.display === 'none') {
        buttons.style.display = 'grid';
        arrow.innerHTML = '&#9660;';
    } else {
        buttons.style.display = 'none';
        arrow.innerHTML = '&#9654;';
    }
}

function showTempoPopup() {
    document.getElementById('tempo-popup').style.display = 'block';
}

function hideTempoPopup() {
    document.getElementById('tempo-popup').style.display = 'none';
}

function setTempo() {
    // Functionality to set tempo can be added here
    hideTempoPopup();
}
