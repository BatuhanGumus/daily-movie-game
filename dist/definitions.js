export class Card {
    constructor(element, spawn, id) {
        this.correctlyPlaced = false;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.placedOn = null;
        this.id = 0;
        this.element = element;
        this.spawn = spawn;
        this.id = id;
    }
}
export class Placement {
    constructor(element) {
        this.card = null;
        this.element = element;
    }
}
