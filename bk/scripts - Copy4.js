// Show and hide the new composition popup
function showNewCompositionPopup() {
    document.getElementById('new-composition-popup').style.display = 'block';
}

function hideNewCompositionPopup() {
    document.getElementById('new-composition-popup').style.display = 'none';
}

// Create a new composition
function createNewComposition() {
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const composer = document.getElementById('composer-input').value;
    const lyricist = document.getElementById('lyricist-input').value;
    const copyright = document.getElementById('copyright-input').value;

    document.getElementById('composition-title').textContent = title;
    document.getElementById('composition-subtitle').textContent = subtitle;
    document.getElementById('composer').textContent = `Composer: ${composer}`;
    document.getElementById('lyricist').textContent = `Lyricist: ${lyricist}`;
    document.getElementById('copyright').textContent = copyright;

    hideNewCompositionPopup();
}

// Add event listener to the "New" button in the main menu
document.querySelector('#main-menu a[href="#"]').addEventListener('click', function() {
    showNewCompositionPopup();
});
// Function to show the popup for creating a new composition
function showNewCompositionPopup() {
    const popup = document.getElementById('new-composition-popup');
    popup.style.display = 'block';
}

// Add event listener to the "New" button in the icon bar
const newButtonIconBar = document.querySelector('#icon-bar-1 img[alt="New"]');
if (newButtonIconBar) {
    newButtonIconBar.addEventListener('click', showNewCompositionPopup);
}
// Existing code for the tempo popup and palette sections
function showTempoPopup() {
    document.getElementById('tempo-popup').style.display = 'block';
}

function hideTempoPopup() {
    document.getElementById('tempo-popup').style.display = 'none';
}

function setTempo() {
    const tempo = document.getElementById('tempo').value;
    alert(`Tempo set to ${tempo} BPM`);
    hideTempoPopup();
}

function toggleSection(header) {
    const section = header.nextElementSibling;
    const arrow = header.querySelector('.arrow');
    if (section.style.display === 'none') {
        section.style.display = 'grid';
        arrow.innerHTML = '&#9660;';
    } else {
        section.style.display = 'none';
        arrow.innerHTML = '&#9654;';
    }
}

// Ensure palette stays within screen bounds
const paletteBox = document.getElementById('palette-box');
paletteBox.addEventListener('mousedown', function (e) {
    let shiftX = e.clientX - paletteBox.getBoundingClientRect().left;
    let shiftY = e.clientY - paletteBox.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        let newLeft = pageX - shiftX;
        let newTop = pageY - shiftY;

        // Prevent going out of screen bounds
        if (newLeft < 0) newLeft = 0;
        if (newLeft + paletteBox.offsetWidth > window.innerWidth) {
            newLeft = window.innerWidth - paletteBox.offsetWidth;
        }
        if (newTop < 0) newTop = 0;
        if (newTop + paletteBox.offsetHeight > window.innerHeight) {
            newTop = window.innerHeight - paletteBox.offsetHeight;
        }

        paletteBox.style.left = newLeft + 'px';
        paletteBox.style.top = newTop + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    paletteBox.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        paletteBox.onmouseup = null;
    };
});

paletteBox.ondragstart = function () {
    return false;
};
