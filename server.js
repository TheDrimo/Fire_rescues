const WebSocket = require('ws');
const Player = require('./player'); // Assurez-vous que ce fichier existe et est correctement implémenté
const Grid = require('./grid');     // De même pour ce fichier

const wss = new WebSocket.Server({ port: 8080 });
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
    const player = ws.player;

    switch (data.type) {
        case 'move':
            // Mise à jour de la position du joueur
            player.x = data.x;
            player.y = data.y;
            broadcastPlayerPosition(player);
            break;
        // Ajoutez d'autres cas au besoin
        default:
            console.log(`Type de message non reconnu: ${data.type}`);
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
        if (client.readyState === WebSocket.OPEN && client.player.id !== player.id) {
            client.send(payload);
        }
    });
}

const grid = new Grid(); // Création de la grille de jeu

console.log('Serveur WebSocket démarré sur le port 8080');
