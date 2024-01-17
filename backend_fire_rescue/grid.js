const config = require('./config.js'); 

class Grid {
    constructor() {
        this.fires = []; // Tableau pour stocker les feux
        this.startFireGeneration();
    }

    startFireGeneration() {
        setInterval(() => {
            this.createFire();
        }, 10000); // Crée un feu toutes les 10 secondes
    }

    createFire() {
        const x = Math.floor(Math.random() * 1000); // Coordonnée X aléatoire entre 0 et 1000
        const y = Math.floor(Math.random() * 1000); // Coordonnée Y aléatoire entre 0 et 1000
        const fire = { x, y, type: 'fire', hp: 1000 };
        this.fires.push(fire);

        console.log(`Nouveau feu créé en position (${x}, ${y})`);
        // Envoyez les informations du feu au front-end si nécessaire
    }

    checkFireInteraction(player) {
        this.fires.forEach(fire => {
            const distance = Math.sqrt((fire.x - player.x) ** 2 + (fire.y - player.y) ** 2);
            if (distance < config.game.FIRE_INTERACTION_DISTANCE) {
                fire.hp -= config.game.FIRE_DAMAGE; // SOME_DAMAGE est la quantité de dégâts infligés par le joueur au feu
                console.log(`Feu en position (${fire.x}, ${fire.y}) a maintenant ${fire.hp} HP.`);
                if (fire.hp <= 0) {
                    console.log(`Feu en position (${fire.x}, ${fire.y}) éteint.`);
                    // Vous pouvez ici retirer le feu du tableau
                }
            }
            if (distance < config.game.FIRE_SAFE_DISTANCE) {
                player.takeDamage(config.game.FIRE_DAMAGE_TO_PLAYER); // FIRE_DAMAGE_TO_PLAYER est la quantité de dégâts subis par le joueur
            }
        });

        this.fires = this.fires.filter(fire => fire.hp > 0); // Filtrer les feux éteints
    }
}

module.exports = Grid;
