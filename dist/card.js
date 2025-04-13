import { sqrDistance, setPosition } from './util.js';
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
function InitCard(cardDiv, card, filmInfo) {
    const cardimg = document.createElement("img");
    const cardText = document.createElement('H3');
    cardimg.src = filmInfo.posterSrc;
    cardText.innerHTML = filmInfo.title;
    cardimg.setAttribute('draggable', "false");
    cardText.setAttribute('draggable', "false");
    cardDiv.appendChild(cardimg);
    cardDiv.appendChild(cardText);
    cardDiv.classList.add('cardShape', 'card', "thickness");
    cardDiv.addEventListener("pointerdown", (e) => {
        if (card.correctlyPlaced)
            return;
        card.isDragging = true;
        card.offsetX = e.clientX - cardDiv.offsetLeft;
        card.offsetY = e.clientY - cardDiv.offsetTop;
        cardDiv.style.cursor = "grabbing";
        cardDiv.style.zIndex = "1000";
    });
    document.addEventListener("pointermove", (e) => {
        if (card.isDragging) {
            cardDiv.style.left = `${e.clientX - card.offsetX}px`;
            cardDiv.style.top = `${e.clientY - card.offsetY}px`;
        }
    });
    document.addEventListener("pointerup", () => {
        if (!card.isDragging)
            return;
        card.isDragging = false;
        cardDiv.style.cursor = "grab";
        cardDiv.style.zIndex = "1";
        let isPlaced = false;
        const cardRect = cardDiv.getBoundingClientRect();
        for (let placement of placements) {
            const rect = placement.element.getBoundingClientRect();
            const distance = sqrDistance(rect.left + rect.width / 2, rect.top + rect.height / 2, cardRect.left + cardRect.width / 2, cardRect.top + cardRect.height / 2);
            if (distance < 4000) {
                if (placement.card == null) {
                    setPosition(cardDiv, rect);
                    if (card.placedOn != null)
                        card.placedOn.card = null;
                    card.placedOn = placement;
                    placement.card = card;
                }
                else {
                    if (card.placedOn != null) {
                        let placedCard = placement.card;
                        placedCard.placedOn = card.placedOn;
                        if (placedCard.placedOn != null) {
                            setPosition(placedCard.element, placedCard.placedOn.element.getBoundingClientRect());
                            placedCard.placedOn.card = placedCard;
                        }
                        card.placedOn = placement;
                        setPosition(cardDiv, placement.element.getBoundingClientRect());
                        placement.card = card;
                    }
                    else {
                        placement.card.placedOn = null;
                        setPosition(placement.card.element, placement.card.spawn.getBoundingClientRect());
                        setPosition(cardDiv, rect);
                        card.placedOn = placement;
                        placement.card = card;
                    }
                }
                isPlaced = true;
                break;
            }
        }
        if (!isPlaced) {
            const rect = card.spawn.getBoundingClientRect();
            setPosition(cardDiv, rect);
            if (card.placedOn != null)
                card.placedOn.card = null;
            card.placedOn = null;
        }
    });
    return cardDiv;
}
