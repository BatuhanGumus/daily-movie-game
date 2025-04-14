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
        this.topLayer = document.createElement("div");
        cardimg.src = cardInfo.imgSource;
        cardText.innerHTML = cardInfo.title;
        this.topLayer.classList.add('top-layer');
        this.element.appendChild(cardimg);
        this.element.appendChild(cardText);
        this.element.appendChild(this.topLayer);
        this.element.classList.add('card-shape', 'card', 'three-dimensional', "thickness");
        this.element.dataset.thickness = "3";
    }
    MoveToPlaced() {
        setPosition(this.element, this.placedOn.rect());
    }
    correct() {
        let duration = 600;
        this.correctlyPlaced = true;
        this.element.classList.add('correct-placement');
        const animation = this.topLayer.animate([
            {
                backgroundColor: 'rgba(0, 255, 0, 0)'
            },
            {
                backgroundColor: 'rgba(121, 255, 121, 0.5)'
            }
        ], {
            duration: duration,
            fill: 'forwards',
            easing: 'ease-out',
        });
        return duration;
    }
    incorrect() {
        let duration = 600;
        const animation = this.topLayer.animate([
            {
                backgroundColor: 'rgba(0, 255, 0, 0)'
            },
            {
                backgroundColor: 'rgba(255, 122, 113, 0.45)'
            },
            {
                backgroundColor: 'rgba(255, 122, 113, 0.45)'
            },
            {
                backgroundColor: 'rgba(255, 122, 113, 0.45)'
            },
            {
                backgroundColor: 'rgba(0, 255, 0, 0)'
            }
        ], {
            duration: duration,
            fill: 'forwards',
            easing: 'ease-out',
        });
        return duration;
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
