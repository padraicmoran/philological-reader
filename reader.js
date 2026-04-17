
// dictionaries
const dictionaries = [
    {
        id: "wiktionary",
        label: "Wiktionary",
        url: (word) => `https://en.wiktionary.org/wiki/${word}`
    },
    {
        id: "dil",
        label: "DIL",
        url: (word) => `https://dil.ie/search?q=${word}`
    },
    {
        id: "logeion",
        label: "Logeion",
        url: (word) => `https://logeion.uchicago.edu/${word.toLowerCase()}`
    },
    {
        id: "perseus",
        label: "Perseus",
        url: (word) => `https://www.perseus.tufts.edu/hopper/morph?l=${word.toLowerCase()}&la=la`
    }
];

// DOM Elements
const resizer = document.getElementById('resizer');
const sidebar = document.getElementById('sidebar');
const inputSection = document.getElementById('input-section');
const readerSection = document.getElementById('reader-section');
const textContainer = document.getElementById('text-container');
const rawInput = document.getElementById('raw-input');
const frame = document.getElementById('lookup-frame');
const btnGo = document.getElementById('btn-go');
const btnChangeText = document.getElementById('btn-change-text');
const dictContainer = document.getElementById('dictionary-toggle-container');

// Generate the buttons dynamically from the array
function renderDictionaryButtons() {
    dictContainer.innerHTML = dictionaries.map((dict, index) => `
        <input type="radio" class="btn-check" name="lang" 
               id="dict-${dict.id}" value="${dict.id}" 
               ${index === 0 ? 'checked' : ''}>
        <label class="btn btn-outline-secondary" for="dict-${dict.id}">
            ${dict.label}
        </label>
    `).join('');
}
// Call this immediately
renderDictionaryButtons();

// --- Resizer Functionality ---
let isResizing = false;

resizer.addEventListener('mousedown', () => { 
    isResizing = true; 
    document.body.classList.add('dragging'); 
    resizer.classList.add('active'); 
});

document.addEventListener('mouseup', () => { 
    isResizing = false; 
    document.body.classList.remove('dragging'); 
    resizer.classList.add('active'); 
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 150 && newWidth < window.innerWidth * 0.8) {
        sidebar.style.width = `${newWidth}px`;
    }
});

// --- Text Processing ---
btnGo.addEventListener('click', () => {
    const text = rawInput.value.trim();
    if (!text) return;

    const lines = text.split('\n');
    const processedHtml = lines.map(line => {
        return line.split(/(\s+)/).map(segment => {
            if (segment.match(/^\s+$/)) return segment;
            const cleanWord = segment.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
            return `<span class="word" data-word="${cleanWord}">${segment}</span>`;
        }).join('');
    }).join('\n');

    textContainer.innerHTML = processedHtml;
    toggleView(true);
});

btnChangeText.addEventListener('click', () => toggleView(false));

function toggleView(isReaderMode) {
    if (isReaderMode) {
        inputSection.classList.add('d-none');
        readerSection.classList.remove('d-none');
        btnChangeText.classList.remove('d-none');
    } else {
        readerSection.classList.add('d-none');
        btnChangeText.classList.add('d-none');
        inputSection.classList.remove('d-none');
    }
}

// --- Dictionary Lookup ---
textContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('word')) {
        const word = e.target.getAttribute('data-word');
        
        // Get the ID of the currently selected radio button
        const selectedId = document.querySelector('input[name="lang"]:checked').value;
        
        // Find the dictionary object in our array
        const activeDict = dictionaries.find(d => d.id === selectedId);
        
        if (activeDict) {
            frame.src = activeDict.url(word);
        }
    }
});