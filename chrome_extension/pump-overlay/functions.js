// functions.js
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

function setupWebSocket() {
    const webSocket = new WebSocket('wss://wss.savannah.haus/websocket/');
    webSocket.onopen = () => console.log('Connection established');
    webSocket.onerror = error => {
        console.error('WebSocket Error:', error);
    };
    webSocket.onmessage = handleWebSocketMessage;
    webSocket.onclose = event => console.log('WebSocket connection closed', event);
}

function handleWebSocketMessage(event) {
    try {
        const jsonData = JSON.parse(event.data);
        const fieldValue = jsonData.content;
        createFloatingDiv(fieldValue);
    } catch (e) {
        console.error('Error parsing JSON or updating input:', e);
    }
}

function handleSubmit(event) {
    event.preventDefault();
    const inputValue = document.querySelector('#message').value;
    publishMessage(inputValue);
    createFloatingDiv(inputValue);
}

function publishMessage(message) {
    fetch('https://dm-gcp-server-z6ohplpqwq-as.a.run.app/pub', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: message })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

function createFloatingDiv(text) {
    const newDiv = document.createElement('div');
    newDiv.textContent = text;
    const top = Math.floor(Math.random() * 60) + 20;
    const rightStart = Math.random() * 100;
    newDiv.classList.add('floatingDiv');
    newDiv.style.top = `${top}%`;
    newDiv.style.right = `-${rightStart}%`;
    document.body.appendChild(newDiv);
    addFloatAnimation();
}

function addFloatAnimation() {
    if (!document.querySelector('#float-animation-style')) {
        const style = document.createElement('style');
        style.id = 'float-animation-style';
        style.innerHTML = `
            @keyframes float {
                0% { right: -20px; }
                100% { right: 100%; }
            }
        `;
        document.head.appendChild(style);
    }
}

function setupElements() {
    document.body.insertAdjacentHTML('beforeend', generateHtml());
    setupWebSocket();
    setupEventListeners();
}

function setupEventListeners() {
    const form = document.querySelector('#form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    } else {
        console.error('Form element not found');
    }

    const celebrateButton = document.querySelector('#celebrate');
    if (celebrateButton) {
        celebrateButton.addEventListener('click', function() {
            // Trigger the celebration (confetti) logic here
            var confetti = new confetti.Context('confetti');
            confetti.start();
        });
    } else {
        console.error('Celebrate button not found');
    }
}

function generateHtml() {
    return `
        <div id="my-overlay">
            <form id="form">
                <p>Pew Pew</p>
                <input id="message" type="text">
                <input id="submit-btn" type="submit" value="Pump it!">
                <button id="celebrate" style="margin-left: 8px;">Celebrate!</button>
            </form>
        </div>
        <canvas id="confetti"></canvas>
    `;
}
