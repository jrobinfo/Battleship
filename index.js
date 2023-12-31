
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let games = {};

function generateGameCode() {
    return Math.random().toString(36).substring(2, 9);
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'create':
                const gameCode = generateGameCode();
                games[gameCode] = { players: [ws], board: [], gameState: 'waiting' };
                ws.send(JSON.stringify({ type: 'gameCode', gameCode }));
                break;
            case 'join':
                if (games[data.gameCode] && games[data.gameCode].players.length === 1) {
                    games[data.gameCode].players.push(ws);
                    games[data.gameCode].gameState = 'active';
                    notifyPlayers(data.gameCode, { type: 'startGame' });
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Invalid game code' }));
                }
                break;
            case 'move':
                // Handle player moves and game logic here
                break;
        }
    });
});

function notifyPlayers(gameCode, message) {
    games[gameCode].players.forEach((playerWs) => {
        playerWs.send(JSON.stringify(message));
    });
}

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
