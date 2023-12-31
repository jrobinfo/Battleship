// Determine the appropriate WebSocket protocol based on the current page protocol
let wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(wsProtocol + '//' + window.location.host);

ws.onopen = function() {
    console.log('Connected to the server');
};

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  switch (data.type) {
      case 'gameCode':
          console.log("Game code received: " + data.gameCode);
          displayGameCode(data.gameCode);
          break;
      case 'startGame':
          console.log("Game started");
          startGameUI();
          break;
      case 'error':
          alert(data.message);
          break;
      // Handle other messages and game updates
  }
};

function startGameUI() {
    // Code to update the UI for game start
    // For example, hide the lobby and show the game board
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'block'; // Make game board visible
}

function displayGameCode(gameCode) {
  // Assuming you have an element to display the game code
  const gameCodeDisplay = document.getElementById('gameCodeDisplay');
  if (gameCodeDisplay) {
      gameCodeDisplay.textContent = 'Game Code: ' + gameCode;
  }
};

document.getElementById('createGameBtn').addEventListener('click', function() {
    console.log("Create game button clicked");
    ws.send(JSON.stringify({ type: 'create' }));
});

document.getElementById('joinGameBtn').addEventListener('click', function() {
    const gameCode = document.getElementById('gameCodeInput').value;
    console.log("Join game button clicked, game code: " + gameCode);
    ws.send(JSON.stringify({ type: 'join', gameCode: gameCode }));
});

// Additional game interaction logic...
function initializeBoard(boardElement) {
  for (let i = 0; i < 100; i++) {
      let cell = document.createElement('div');
      // Add additional attributes and event listeners to each cell
      boardElement.appendChild(cell);
  }
}

// Initialize both player and opponent boards
initializeBoard(document.getElementById('playerBoard'));
initializeBoard(document.getElementById('opponentBoard'));
