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

// Style definitions
const styles = {
    overlay: `
        position: fixed;
        bottom: 0px;
        left: 0px;
        right: 0px;
        background: white;
        border: 1px solid gray;
        padding: 8px;
        z-index: 999999;
    `,
    form: `
        display: flex;
        gap: 8px;
        align-items: center;
        width: 80%;
    `,
    input: `
        border: 1px solid black;
        border-radius: 2px;
        padding: 2px;
        flex-grow: 1;
    `,
    canvas: `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: 999998;
        pointer-events: none;
    `,
    fireworksCanvas: `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000000;
        pointer-events: none;
    `,
    floatingDiv: (top, rightStart) => `
        position: fixed;
        top: ${top}%;
        right: -${rightStart}%;
        transform: translateX(-50%);
        animation: float 10s ease-in-out forwards;
        background-image: linear-gradient(to right, #E70000, #FF8C00, #FFEF00, #00811F, #0044FF, #760089);
        font-size: 2rem;
        -webkit-background-clip: text;
        color: transparent;
    `,
    floatAnimation: `
        @keyframes float {
            0% { right: -20px; }
            100% { right: 100%; }
        }
    `
};

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

// Apply CSS styles
function applyStyles() {
    document.querySelector('#my-overlay').style.cssText = styles.overlay;
    document.querySelector('#form').style.cssText = styles.form;
    document.querySelector('#message').style.cssText = styles.input;
    document.querySelector('#confetti').style.cssText = styles.canvas;
    document.querySelector('#fireworks').style.cssText = styles.fireworksCanvas;
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const inputValue = document.querySelector('#message').value;
    publishMessage(inputValue);
    createFloatingDiv(inputValue, 5000); // 5 seconds duration
}

// Create and display floating div
function createFloatingDiv(text, duration) {
    const newDiv = document.createElement('div');
    newDiv.textContent = text;
    const top = Math.floor(Math.random() * 60) + 20;
    const rightStart = Math.random() * 100;
    newDiv.style.cssText = styles.floatingDiv(top, rightStart);
    document.body.appendChild(newDiv);
    addFloatAnimation();
    setTimeout(() => {
        document.body.removeChild(newDiv);
    }, duration);
}

// Add keyframes for float animation
function addFloatAnimation() {
    if (!document.querySelector('#float-animation-style')) {
        const style = document.createElement('style');
        style.id = 'float-animation-style';
        style.innerHTML = styles.floatAnimation;
        document.head.appendChild(style);
    }
}

// Initialize the script
function setupElements() {
    document.body.insertAdjacentHTML('beforeend', generateHtml());
    applyStyles();
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
window.styles = styles;
window.generateHtml = generateHtml;
window.applyStyles = applyStyles;
window.handleSubmit = handleSubmit;
window.createFloatingDiv = createFloatingDiv;
window.addFloatAnimation = addFloatAnimation;
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
