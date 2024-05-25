// Setup WebSocket connection
function setupWebSocket() {
    const webSocket = new WebSocket('wss://wss.savannah.haus/websocket/');
    webSocket.onopen = () => console.log('Connection established');
    webSocket.onerror = error => {
        console.error('WebSocket Error:', error);
    };
    webSocket.onmessage = handleWebSocketMessage;
    webSocket.onclose = event => console.log('WebSocket connection closed', event);
}

// Handle WebSocket message
function handleWebSocketMessage(event) {
    try {
        const jsonData = JSON.parse(event.data);

        // Check for the specific structure to trigger a function
        if (jsonData.type === "0" && jsonData.source === "3") {
            const functionName = jsonData.content;
            if (typeof window[functionName] === "function") {
                console.log(`Executing function: ${functionName}`);
                window[functionName](config.animationDuration);
            } else {
                console.error(`Function ${functionName} not found`);
            }
        } else {
            const fieldValue = jsonData.content;
            console.log('Displaying text:', fieldValue);
            window.createFloatingDiv(fieldValue, config.transactionDisplayDuration); // 5 seconds duration
        }
    } catch (e) {
        console.error('Error parsing JSON or updating input:', e);
    }
}

// Publish message to server
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

// Publish animation parameters to server
function publishAnimation(command) {
    const animationParams = { type: "0", content: command, source: "3" };
    fetch('https://dm-gcp-server-z6ohplpqwq-as.a.run.app/pub', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(animationParams)
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}


// Function to trigger celebration
function celebration() {
    triggerCelebrate(config.animationDuration);
}

// Function to trigger celebration
function fireworks() {
    triggerFireworks(config.animationDuration);
}


// Expose functions to global scope
window.setupWebSocket = setupWebSocket;
window.handleWebSocketMessage = handleWebSocketMessage;
window.publishMessage = publishMessage;
window.publishAnimation = publishAnimation;
