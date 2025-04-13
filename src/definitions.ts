import {setPosition, AnimateToPosition} from './util.js';

class GameObject
{
  element : HTMLElement;

  constructor(element :HTMLElement) {
    this.element = element;
  }

  rect() : DOMRect {
    return this.element.getBoundingClientRect();
  }
}

export class Card extends GameObject
{
  correctlyPlaced = false;
  isDragging = false;
  offsetX = 0;
  offsetY = 0;
  
  placedOn : Placement;
  id = 0;

  constructor(cardInfo :any, placedOn :Placement, id :number) 
  {
    super(document.createElement("div"));
    this.placedOn = placedOn;
    placedOn.cardOnIt = this;
    this.id = id;

    const cardimg = document.createElement("img");
    const cardText = document.createElement('H3');
    cardimg.src = cardInfo.imgSource;
    cardText.innerHTML = cardInfo.title
    this.element.appendChild(cardimg);
    this.element.appendChild(cardText);

    this.element.classList.add('card-shape', 'card', 'three-dimensional', "thickness");
    this.element.dataset.thickness = "3";
  }

  MoveToPlaced()
  {
    setPosition(this.element, this.placedOn.rect());
  }
}

export class Placement extends GameObject
{
  cardOnIt : Card | null = null;

  rect() : DOMRect {
    return this.element.getBoundingClientRect();
  }

  constructor(element :HTMLElement) {
    super(element);
  }
}
