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
    confetti: `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: 999998;
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
    document.querySelector('#confetti').style.cssText = styles.confetti;
    document.querySelector('#fireworks').style.cssText = styles.fireworksCanvas;
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const inputValue = document.querySelector('#message').value;
    publishMessage(inputValue);
    createFloatingDiv(inputValue);
}

// Create and display floating div
function createFloatingDiv(text) {
    const newDiv = document.createElement('div');
    newDiv.textContent = text;
    const top = Math.floor(Math.random() * 60) + 20;
    const rightStart = Math.random() * 100;
    newDiv.style.cssText = styles.floatingDiv(top, rightStart);
    document.body.appendChild(newDiv);
    addFloatAnimation();
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
            triggerFireworks();
        });
    } else {
        console.error('Fireworks button not found');
    }
  }

  function triggerFireworks() {
    const canvas = document.getElementById('fireworks');
    if (canvas) {
        canvas.style.display = 'block';
        startFireworks('fireworks', 5000); // 5 seconds duration
    } else {
        console.error('Fireworks canvas not found');
    }
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