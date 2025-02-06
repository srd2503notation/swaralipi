// Initialize variables
let currentDuration = '5'; // Default to quarter note
let currentBeatCount = 0;
let currentGroupElement = null;
let currentGroupBeatCount = 0;
let currentTimeSignature = { beats: 4, value: 4 }; // Default 4/4 time

const noteMap = {
    's': 'सा',
    'r': 'रे',
    'g': 'ग',
    'm': 'म',
    'p': 'प',
    'd': 'ध',
    'n': 'नि'
};

function createMusicEditor(title, composer, lyricist, copyright, timeSignature, keySignature) {
    // Parse time signature
    const [beats, value] = timeSignature.split('/').map(Number);
    currentTimeSignature = { beats, value };
    currentBeatCount = 0;
    currentGroupElement = null;
    currentGroupBeatCount = 0;
    
    // Remove existing editor if present
    const existingEditor = document.getElementById('music-editor-container');
    if (existingEditor) {
        existingEditor.remove();
    }
    
    // Create new editor container
    const editorContainer = document.createElement('div');
    editorContainer.id = 'music-editor-container';
    
    editorContainer.innerHTML = `
        <div class="composition-details">
            <h1>${title}</h1>
            ${composer ? `<p class="composer">Composer: ${composer}</p>` : ''}
            ${lyricist ? `<p class="lyricist">Lyricist: ${lyricist}</p>` : ''}
            ${copyright ? `<p class="copyright">${copyright}</p>` : ''}
            <p class="time-signature">Time Signature: ${timeSignature}</p>
            <p class="key-signature">Key Signature: ${keySignature}</p>
        </div>
        <div class="notation-editor">
            <div id="notation-line" class="notation-line" tabindex="0"></div>
        </div>
    `;
    
    // Find the palettes div and insert editor after it
    const palettes = document.querySelector('.palettes');
    if (palettes) {
        palettes.insertAdjacentElement('afterend', editorContainer);
    } else {
        document.getElementById('main-menu').appendChild(editorContainer);
    }
    
    const notationLine = document.getElementById('notation-line');
    
    // Add initial barline
    const initialBarline = document.createElement('span');
    initialBarline.className = 'barline';
    initialBarline.textContent = '|';
    notationLine.appendChild(initialBarline);
    
    // Add space after barline
    const space = document.createTextNode(' ');
    notationLine.appendChild(space);
    
    // Set cursor after barline
    const range = document.createRange();
    range.setStartAfter(space);
    range.collapse(true);
    
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    
    // Initialize variables for keyboard input
    let lastKeyPressed = '';
    let lastKeyTime = 0;
    
    // Handle keyboard input
    notationLine.addEventListener('keydown', function(e) {
        e.preventDefault();
        
        const key = e.key.toLowerCase();
        const currentTime = Date.now();
        
        // Prevent double triggers
        if (key === lastKeyPressed && currentTime - lastKeyTime < 100) {
            return;
        }
        
        lastKeyPressed = key;
        lastKeyTime = currentTime;
        
        // Only allow specific shortcuts
        const allowedKeys = ['s', 'r', 'g', 'm', 'p', 'd', 'n', ' ', '1', '2', '3', '4', '5', '6', '7'];
        
        if (!allowedKeys.includes(key)) {
            return;
        }
        
        // Handle duration keys (1-7)
        if (/^[1-7]$/.test(key)) {
            currentDuration = key;
            return;
        }
        
        // Handle note keys
        if (noteMap[key]) {
            insertNote(key);
            return;
        }
        
        // Handle space for rest
        if (key === ' ') {
            insertRest();
            return;
        }
    });
    
    // Prevent paste events
    notationLine.addEventListener('paste', function(e) {
        e.preventDefault();
    });
    
    // Prevent drag and drop
    notationLine.addEventListener('drop', function(e) {
        e.preventDefault();
    });
    
    // Prevent cut events
    notationLine.addEventListener('cut', function(e) {
        e.preventDefault();
    });
    
    // Prevent context menu
    notationLine.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    // Focus the editor
    notationLine.focus();
}

// Function to show new composition dialog
function showNewCompositionDialog() {
    // Get the dialog element
    const dialog = document.getElementById('editor-dialog');
    if (!dialog) {
        console.error('Dialog not found');
        return;
    }
    
    // Show the dialog
    dialog.style.display = 'block';
    
    // Get form elements
    const form = dialog.querySelector('form');
    const titleInput = dialog.querySelector('#title');
    const composerInput = dialog.querySelector('#composer');
    const lyricistInput = dialog.querySelector('#lyricist');
    const copyrightInput = dialog.querySelector('#copyright');
    
    // Clear previous values
    titleInput.value = '';
    composerInput.value = '';
    lyricistInput.value = '';
    copyrightInput.value = '';
    
    // Handle form submission
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // Get values
        const title = titleInput.value || 'Untitled';
        const composer = composerInput.value || '';
        const lyricist = lyricistInput.value || '';
        const copyright = copyrightInput.value || '';
        
        // Hide dialog first
        dialog.style.display = 'none';
        
        // Create editor after dialog is hidden
        setTimeout(() => {
            createMusicEditor(title, composer, lyricist, copyright, '4/4', 'C');
        }, 0);
    };
    
    // Handle cancel button
    dialog.querySelector('#cancel-editor-button').onclick = function() {
        dialog.style.display = 'none';
    };
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add click handler for the File > New menu
    document.querySelector('#new-button').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showNewCompositionDialog();
    });
});

// Duration value mapping
const durationMap = {
    '1': 0.125,  // 1/64 note (1/32 of quarter)
    '2': 0.25,   // 1/32 note (1/8 of quarter)
    '3': 0.5,    // 1/16 note (1/4 of quarter)
    '4': 1.0,    // 1/8 note (1/2 of quarter)
    '5': 2.0,    // quarter note (1 beat)
    '6': 4.0,    // half note (2 beats)
    '7': 8.0     // full note (4 beats)
};

// Function to get duration value
function getDurationValue(duration) {
    return durationMap[duration] || 2.0; // default to quarter note
}

// Function to check if note needs grouping
function needsGrouping(duration) {
    return ['1', '2', '3', '4'].includes(duration); // Group all notes shorter than quarter
}

// Function to get notes needed for a complete group
function getNotesForCompleteGroup(duration) {
    switch(duration) {
        case '1': return 32; // 32 1/64th notes make a quarter
        case '2': return 8;  // 8 1/32nd notes make a quarter
        case '3': return 4;  // 4 1/16th notes make a quarter
        case '4': return 2;  // 2 1/8th notes make a quarter
        default: return 1;
    }
}

// Function to insert note into editor
function insertNote(note, duration = currentDuration) {
    const notationLine = document.getElementById('notation-line');
    
    if (notationLine) {
        const durationValue = getDurationValue(duration);
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        if (needsGrouping(duration)) {
            // Create note text
            const noteText = document.createElement('span');
            noteText.className = 'note-text';
            noteText.textContent = noteMap[note.toLowerCase()] || note;
            
            // Create or use existing group
            if (!currentGroupElement) {
                currentGroupElement = document.createElement('span');
                currentGroupElement.className = 'note-group';
                currentGroupBeatCount = 0;
                range.insertNode(currentGroupElement);
            }
            
            currentGroupElement.appendChild(noteText);
            currentGroupBeatCount += durationValue;
            
            // Check if group is complete (equals one quarter note)
            if (currentGroupBeatCount >= 2.0) {
                const space = document.createTextNode(' ');
                range.setStartAfter(currentGroupElement);
                range.insertNode(space);
                range.setStartAfter(space);
                
                currentGroupElement = null;
                currentGroupBeatCount = 0;
            }
        } else {
            // For quarter notes and longer
            const noteContainer = document.createElement('span');
            noteContainer.className = 'note-container';
            
            const noteText = document.createElement('span');
            noteText.className = 'note-text';
            noteText.textContent = noteMap[note.toLowerCase()] || note;
            noteContainer.appendChild(noteText);
            
            // Add dashes for half and full notes
            if (duration === '6' || duration === '7') {
                const dashCount = duration === '7' ? 3 : 1;
                for (let i = 0; i < dashCount; i++) {
                    const dash = document.createElement('span');
                    dash.className = 'duration-dash';
                    dash.textContent = '—';
                    noteContainer.appendChild(dash);
                }
            }
            
            range.insertNode(noteContainer);
            
            const space = document.createTextNode(' ');
            range.setStartAfter(noteContainer);
            range.insertNode(space);
            range.setStartAfter(space);
        }
        
        // Update beat count and check for barline
        currentBeatCount += durationValue;
        console.log('Current beat count:', currentBeatCount);
        
        if (currentBeatCount >= 8.0) { // 8 beats = 4 quarter notes in 4/4 time
            const barline = document.createElement('span');
            barline.className = 'barline';
            barline.textContent = '|';
            range.insertNode(barline);
            
            const space = document.createTextNode(' ');
            range.setStartAfter(barline);
            range.insertNode(space);
            range.setStartAfter(space);
            
            currentBeatCount = 0;
            currentGroupElement = null;
            currentGroupBeatCount = 0;
            
            console.log('Added barline, reset beat count');
        }
        
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        notationLine.focus();
    }
}

// Function to insert rest
function insertRest(duration = currentDuration) {
    const notationLine = document.getElementById('notation-line');
    
    if (notationLine) {
        const durationValue = getDurationValue(duration);
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        // Create rest container
        const restContainer = document.createElement('span');
        restContainer.className = 'rest-container';
        
        // Create rest symbol
        const restSymbol = document.createElement('span');
        restSymbol.className = 'rest-symbol';
        restSymbol.textContent = '-';
        restContainer.appendChild(restSymbol);
        
        // Add dashes for longer rests
        if (duration === '6' || duration === '7') {
            const dashCount = duration === '7' ? 3 : 1;
            for (let i = 0; i < dashCount; i++) {
                const dash = document.createElement('span');
                dash.className = 'duration-dash';
                dash.textContent = '—';
                restContainer.appendChild(dash);
            }
        }
        
        range.insertNode(restContainer);
        
        const space = document.createTextNode(' ');
        range.setStartAfter(restContainer);
        range.insertNode(space);
        range.setStartAfter(space);
        
        // Update beat count and check for barline
        currentBeatCount += durationValue;
        if (currentBeatCount >= 8.0) { // 8 beats = 4 quarter notes in 4/4 time
            const barline = document.createElement('span');
            barline.className = 'barline';
            barline.textContent = '|';
            range.insertNode(barline);
            
            const space = document.createTextNode(' ');
            range.setStartAfter(barline);
            range.insertNode(space);
            range.setStartAfter(space);
            
            currentBeatCount = 0;
            currentGroupElement = null;
            currentGroupBeatCount = 0;
        }
        
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        notationLine.focus();
    }
}

// Function to insert barline
function insertBarline() {
    const notationLine = document.getElementById('notation-line');
    if (notationLine) {
        const barline = document.createElement('span');
        barline.className = 'barline';
        barline.textContent = '|';
        
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.insertNode(barline);
        
        const space = document.createTextNode(' ');
        range.insertNode(space);
        
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        
        notationLine.focus();
    }
}

// Function to create duration markers
function createDurationMarkers(duration) {
    const container = document.createElement('span');
    container.className = 'duration-markers';
    
    if (duration === '7') { // whole note
        for (let i = 0; i < 3; i++) {
            const dash = document.createElement('span');
            dash.className = 'duration-dash';
            dash.textContent = '—';
            container.appendChild(dash);
        }
    } else if (duration === '6') { // half note
        const dash = document.createElement('span');
        dash.className = 'duration-dash';
        dash.textContent = '—';
        container.appendChild(dash);
    } else if (['4', '3', '2', '1'].includes(duration)) { // eighth note and shorter
        const curve = document.createElement('span');
        curve.className = 'duration-curve';
        container.appendChild(curve);
    }
    
    return container;
}