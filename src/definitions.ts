export class Card
{
  correctlyPlaced = false;
  isDragging = false;
  offsetX = 0;
  offsetY = 0;
  element : HTMLElement;
  spawn : HTMLElement;
  placedOn : Placement | null = null;
  id = 0;

  constructor(element :HTMLElement, spawn :HTMLElement, id :number) 
  {
    this.element = element;
    this.spawn = spawn;
    this.id = id;
  }
}

export class Placement
{
  card : Card | null = null;
  element : HTMLElement;

  constructor(element :HTMLElement) {
    this.element = element;
  }
}
