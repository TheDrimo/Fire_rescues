class Player {
    constructor(id) {
        this.id = id; // Un identifiant unique pour le joueur
        this.x = 0; // Position initiale X
        this.y = 0; // Position initiale Y
        this.hp = 500;
        this.speed = 5;
        this.isAlive = true;
    }

    updatePosition(newX, newY) {
        const dx = newX - this.x;
        const dy = newY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.speed) {
            // Calculez une nouvelle position en respectant la vitesse maximale
            const ratio = this.speed / distance;
            this.x += dx * ratio;
            this.y += dy * ratio;
        } else {
            this.x = newX;
            this.y = newY;
        }
    }

    takeDamage(damageAmount) {
        this.hp -= damageAmount;
        console.log(`Joueur ID ${this.id} a maintenant ${this.hp} HP.`)
        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false; // Mettre à jour l'état du joueur comme étant mort
            console.log(`Joueur ID ${this.id} est mort.`);
        }
    }
}

module.exports = Player;
