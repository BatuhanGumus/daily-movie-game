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

  topLayer :HTMLElement;

  constructor(cardInfo :any, placedOn :Placement, id :number) 
  {
    super(document.createElement("div"));
    this.placedOn = placedOn;
    placedOn.cardOnIt = this;
    this.id = id;

    const cardimg = document.createElement("img");
    const cardText = document.createElement('H3');
    this.topLayer = document.createElement("div");
    cardimg.src = cardInfo.imgSource;
    cardText.innerHTML = cardInfo.title
    this.topLayer.classList.add('top-layer');
    this.element.appendChild(cardimg);
    this.element.appendChild(cardText);
    this.element.appendChild(this.topLayer);

    this.element.classList.add('card-shape', 'card', 'three-dimensional', "thickness");
    this.element.dataset.thickness = "3";
  }

  MoveToPlaced()
  {
    AnimateToPosition(this.element, this.placedOn.rect());
  }

  correct() : number
  {
    let duration = 600;

    this.correctlyPlaced = true;
    this.element.classList.add('correct-placement');

    const animation = this.topLayer.animate(
      [
        {
          backgroundColor: 'rgba(0, 255, 0, 0)'
        },
        {
          backgroundColor: 'rgba(121, 255, 121, 0.5)'
        }
      ],
      {
        duration: duration,
        fill: 'forwards',
        easing: 'ease-out',
      }
    );

    return duration;
  }

  incorrect() : number
  {
    let duration = 600;

    const animation = this.topLayer.animate(
      [
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
      ],
      {
        duration: duration,
        fill: 'forwards',
        easing: 'ease-out',
      }
    );

    return duration;
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
