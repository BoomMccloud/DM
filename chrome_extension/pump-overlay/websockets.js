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

        // Check for the specific structure to trigger celebration
        if (jsonData.type === "0" && jsonData.content === "triggerCelebration" && jsonData.source === "3") {
            triggerCelebration();
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

// Function to trigger celebration
function triggerCelebration() {
    const button = document.querySelector('#celebrate');
    if (button) {
        button.click();
    } else {
        console.error('Celebrate button not found');
    }
}

// Expose functions to global scope
window.setupWebSocket = setupWebSocket;
window.handleWebSocketMessage = handleWebSocketMessage;
window.publishMessage = publishMessage;
window.triggerCelebration = triggerCelebration;
