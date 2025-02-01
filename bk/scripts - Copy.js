document.addEventListener('DOMContentLoaded', function() {
    console.log("Welcome to Swaralipi!");

    var paletteBox = document.getElementById("palette-box");
    var header = document.querySelector(".palette-box-header");

    var offsetX, offsetY;

    header.addEventListener('mousedown', function(e) {
        offsetX = e.clientX - paletteBox.offsetLeft;
        offsetY = e.clientY - paletteBox.offsetTop;

        document.addEventListener('mousemove', movePaletteBox);
        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', movePaletteBox);
        });
    });

    function movePaletteBox(e) {
        paletteBox.style.left = (e.clientX - offsetX) + 'px';
        paletteBox.style.top = (e.clientY - offsetY) + 'px';
    }
});

function toggleSection(headerElement) {
    var nextElement = headerElement.nextElementSibling;
    var arrow = headerElement.querySelector('.arrow');
    if (nextElement.style.display === "none" || nextElement.style.display === "") {
        nextElement.style.display = "grid";
        arrow.innerHTML = '&#9650;'; // Up arrow
    } else {
        nextElement.style.display = "none";
        arrow.innerHTML = '&#9660;'; // Down arrow
    }
}
