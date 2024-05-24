// Function to create HTML elements with attributes and inner HTML
function createHtmlElement(tag, attributes, innerHtml) {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
    });
    if (innerHtml) {
        element.innerHTML = innerHtml;
    }
    return element;
}

// Generate HTML structure
function generateHtml() {
    return `
        <div id="my-overlay">
            <form id="form">
                <p>Pew Pew</p>
                <input id="message" type="text">
                <input id="submit-btn" type="submit" value="Pump it!">
                <button id="celebrate" style="margin-left: 8px;">Woot woot!</button>
                <button id="fireworks-btn" style="margin-left: 8px;">Fireworks!</button>
            </form>
        </div>
        <canvas id="confetti"></canvas>
        <canvas id="fireworks"></canvas>
    `;
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const inputValue = document.querySelector('#message').value;
    publishMessage(inputValue);
    window.createFloatingDiv(inputValue, 5000); // 5 seconds duration
}

// Create and display floating div
function createFloatingDiv(text, duration) {
    const newDiv = document.createElement('div');
    newDiv.textContent = text;
    newDiv.className = 'floating-div';
    newDiv.style.top = `${Math.floor(Math.random() * 60) + 20}%`;
    newDiv.style.right = `-${Math.random() * 100}%`;
    document.body.appendChild(newDiv);
    setTimeout(() => {
        document.body.removeChild(newDiv);
    }, duration);
}

// Attach createFloatingDiv to the global window object
window.createFloatingDiv = createFloatingDiv;

// Initialize the script
function setupElements() {
    document.body.insertAdjacentHTML('beforeend', generateHtml());
    setupWebSocket();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    const form = document.querySelector('#form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    } else {
        console.error('Form element not found');
    }

    const fireworksButton = document.querySelector('#fireworks-btn');
    if (fireworksButton) {
        fireworksButton.addEventListener('click', function(event) {
            event.preventDefault();
            triggerFireworks(5000); // 5 seconds duration
        });
    } else {
        console.error('Fireworks button not found');
    }

    const celebrateButton = document.querySelector('#celebrate');
    if (celebrateButton) {
        celebrateButton.addEventListener('click', function(event) {
            event.preventDefault();
            triggerCelebrate(5000); // 5 seconds duration
        });
    } else {
        console.error('Celebrate button not found');
    }
}

// Trigger fireworks display
function triggerFireworks(duration) {
    let canvas = document.getElementById('fireworks');
    if (!canvas) {
        canvas = createCanvas('fireworks');
    }
    canvas.style.display = 'block';
    startFireworks('fireworks', duration);
}

// Trigger celebrate display
function triggerCelebrate(duration) {
    let canvas = document.getElementById('confetti');
    if (!canvas) {
        canvas = createCanvas('confetti');
    }
    canvas.style.display = 'block';
    startCelebrate('confetti', duration);
}

// Expose functions to global scope
window.createHtmlElement = createHtmlElement;
window.generateHtml = generateHtml;
window.handleSubmit = handleSubmit;
window.setupElements = setupElements;
window.setupEventListeners = setupEventListeners;
window.triggerFireworks = triggerFireworks;
window.triggerCelebrate = triggerCelebrate;

// Function to create the canvas element
function createCanvas(id) {
    var canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';  // Make sure it doesn't block any other elements
    canvas.style.zIndex = '999999';  // Ensure it is on top of other elements
    document.body.appendChild(canvas);
    return canvas;
}
