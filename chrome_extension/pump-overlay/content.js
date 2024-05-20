
console.log('init')
document.body.insertAdjacentHTML(
  'beforeend',
  `<div id="my-overlay">
    <form id="form">
      <p>Pew Pew</p>
      <input id="message" type="text" >
      <input id="submit-btn" type="submit" value="Pump it!">
      <button id="celebrate" style="margin-left: 8px;">celebrate</button>
    </form>
  </div>`
);
document.body.insertAdjacentHTML(
  'beforeend',
  `<canvas id="confetti"></canvas>`
);
document.querySelector('#my-overlay').style.cssText =
  `position: fixed;
  bottom: 0px;
  gap:8px;
  left: 0px;
  right:0;
  background: white;
  border: 1px solid gray;
  padding: 8px;
  z-index: 999999;`
document.querySelector('#form').style.cssText =
  `
  display: flex;
  gap: 8px;
  align-items: center;
  width: 80%;
  `
document.querySelector('#message').style.cssText =
  `
  border: 1px solid black;
  border-radius: 2px;
  padding: 2px;
  flex-grow: 1;
  `
document.querySelector('#confetti').style.cssText =
  'position: absolute; bottom: 0px; left: 0px; right:0; top:0; z-index: 999998;';

// WebSocket connection setup
const webSocket = new WebSocket('wss://wss.savannah.haus/websocket/');

webSocket.onopen = function(event) {
  console.log("Connection established");
};

webSocket.onerror = function(error) {
  console.error("WebSocket Error: ", error);
};

webSocket.onmessage = function(event) {
  try {
    // Parse the JSON data received
    const jsonData = JSON.parse(event.data);

    // Extract a specific field from the JSON. Replace 'yourFieldNameHere' with the actual field name
    const fieldValue = jsonData.content;

    // Generate a new div element with the field value as its text content
    var newDiv = document.createElement('div');
    newDiv.textContent = fieldValue;
    newDiv.style.cssText = `
      position: fixed;
      top: ${Math.floor(Math.random() * 60) + 20}%;
      right:0;
      transform: translateX(-50%);
      animation: float 10s ease-in-out forwards;
    `;

    // Add the new div to the body
    document.body.appendChild(newDiv);

    // Define the keyframes for the "float" animation if not already defined
    if (!document.querySelector('#float-animation-style')) {
      var style = document.createElement('style');
      style.id = 'float-animation-style';
      style.innerHTML = `
        @keyframes float {
          0% { right: -20px; }
          100% { right: 100%; }
        }
      `;
      document.head.appendChild(style);
    }
  } catch (e) {
    console.error("Error parsing JSON or updating input:", e);
  }
};

webSocket.onclose = function(event) {
  console.log("WebSocket connection closed");
};

document.querySelector('#form').addEventListener('submit', function (event) {

  console.log('Submitted x');
  event.preventDefault();
  var inputValue = document.querySelector('#message').value;

  // Prepare the data to send to the server
  const postData = {
    "content" : inputValue,
  };

  // Send the data to the server
  fetch('https://vercel-pubsub-server-q5v2a4doda-uc.a.run.app/pub', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
  .then(response => response.text())
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });

  var randomTop = Math.floor(Math.random() * 60) + 20;

  var newDiv = document.createElement('div');
  newDiv.textContent = inputValue;
  newDiv.style.cssText = `
    position: fixed;
    top: ${randomTop}%;
    right:0;
    transform: translateX(-50%);
    animation: float 10s ease-in-out forwards;
  `;

  // Add the new div to the body
  document.body.appendChild(newDiv);

  // Define the keyframes for the "float" animation
  var style = document.createElement('style');
  style.innerHTML = `
    @keyframes float {
      0% { right: -20px; }
      100% { right: 950%; }
    }
  `;
  document.head.appendChild(style);

  });
