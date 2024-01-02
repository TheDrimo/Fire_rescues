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

    // Autres méthodes liées à la grille
}

module.exports = Grid;
