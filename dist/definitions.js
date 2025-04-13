import { setPosition } from './util.js';
class GameObject {
    constructor(element) {
        this.element = element;
    }
    rect() {
        return this.element.getBoundingClientRect();
    }
}
export class Card extends GameObject {
    constructor(cardInfo, placedOn, id) {
        super(document.createElement("div"));
        this.correctlyPlaced = false;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.id = 0;
        this.placedOn = placedOn;
        placedOn.cardOnIt = this;
        this.id = id;
        const cardimg = document.createElement("img");
        const cardText = document.createElement('H3');
        cardimg.src = cardInfo.imgSource;
        cardText.innerHTML = cardInfo.title;
        this.element.appendChild(cardimg);
        this.element.appendChild(cardText);
        this.element.classList.add('card-shape', 'card', 'three-dimensional', "thickness");
        this.element.dataset.thickness = "3";
    }
    MoveToPlaced() {
        setPosition(this.element, this.placedOn.rect());
    }
}
export class Placement extends GameObject {
    rect() {
        return this.element.getBoundingClientRect();
    }
    constructor(element) {
        super(element);
        this.cardOnIt = null;
    }
}
