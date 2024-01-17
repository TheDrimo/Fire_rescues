const WebSocket = require('ws');
const Player = require('./player'); // Assurez-vous que ce fichier existe et est correctement implémenté
const Grid = require('./grid');     // De même pour ce fichier
const config = require('./config.js'); 


const wss = new WebSocket.Server({ port: config.network.WEBSOCKET_PORT });
let players = [];
let playerId = 0;

wss.on('connection', ws => {
    const player = new Player(playerId++);
    players.push(player);
    ws.player = player;

    console.log(`Nouveau joueur connecté : ID ${player.id}`);

    // Envoi de l'état initial (état de la grille, infos du joueur, etc.)
    const initialState = JSON.stringify({ type: 'initialState', playerId: player.id, fires: grid.fires });
    ws.send(initialState);

    ws.on('message', message => {
        try {
            const data = JSON.parse(message);
            handleClientMessage(ws, data);
        } catch (error) {
            console.error('Erreur de traitement du message:', error);
        }
    });

    ws.on('close', () => {
        players = players.filter(p => p.id !== ws.player.id);
        console.log(`Joueur ID ${ws.player.id} déconnecté`);
    });
});

function handleClientMessage(ws, data) {
    //console.log(data, data.type);
    if (data.type === 'move') {
        const player = players.find(p => p.id === data.playerId); // Trouve le joueur par son ID
        if (player) {
            player.updatePosition(data.x, data.y);
            grid.checkFireInteraction(player);
            broadcastPlayerPosition(player); // Diffuse la nouvelle position
        }
    }
}

function broadcastPlayerPosition(player) {
    const payload = JSON.stringify({
        type: 'playerPosition',
        id: player.id,
        x: player.x,
        y: player.y
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });

    const updatedGrid = JSON.stringify({ type: 'updateGrid', grid: grid.fires });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(updatedGrid);
        }
    });

    players.forEach(player => {
    if (!player.isAlive) {
        const deathMessage = JSON.stringify({ type: 'death', message: 'Vous êtes mort.' });
        player.ws.send(deathMessage); // player.ws est la WebSocket associée à ce joueur
        // Vous pouvez également inclure une logique pour le déconnecter ou l'empêcher de jouer
    }
    });
}

const grid = new Grid(); // Création de la grille de jeu

console.log('Serveur WebSocket démarré sur le port 8080');
