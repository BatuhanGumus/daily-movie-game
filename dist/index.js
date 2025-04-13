import { filmCollections } from './database.js';
import { sqrDistance, setPosition, showToast } from './util.js';
import { Card, Placement } from './definitions.js';
let flimCount = 0;
let filmDetails;
let cards = [];
let placements = [];
let answer = new Map();
let attemptCount = 0;
let maxAttempts = 3;
let attemptCounterText = null;
document.addEventListener('DOMContentLoaded', initGame);
window.addEventListener("resize", moveCardsToWindowResize);
function initGame() {
    initAnswer();
    InitPlayArea();
}
function initAnswer() {
    const random = Math.floor(Math.random() * filmCollections.length);
    filmDetails = filmCollections[random];
    flimCount = filmDetails.length;
    let i = 0;
    let pullData = new Map();
    for (let film of filmDetails) {
        pullData.set(i, film.rating);
        i++;
    }
    answer = new Map([...pullData.entries()].sort((a, b) => a[1] - b[1]));
}
function InitPlayArea() {
    InitPlacementBoard();
    InitCheckBoard();
    InitSpawnBoard();
}
function InitPlacementBoard() {
    const placementParent = document.getElementById("placement-parent");
    const lowestRatedText = document.getElementById("lowest-text");
    lowestRatedText.innerText = "Lowest\nRated";
    for (let i = 0; i < flimCount; i++) {
        const cardPlacement = document.createElement("div");
        cardPlacement.classList.add('cardShape', 'cardPlacement');
        placementParent.appendChild(cardPlacement);
        const placemnt = new Placement(cardPlacement);
        placements.push(placemnt);
    }
    const highestRated = document.getElementById("highest-text");
    highestRated.innerText = "Highest\nRated";
}
function InitCheckBoard() {
    attemptCounterText = document.getElementById("attempt-counter");
    attemptCounterText.innerText = `❤️`.repeat(maxAttempts);
    const checkButton = document.getElementById("check-button");
    checkButton.addEventListener("click", checkCards);
}
function InitSpawnBoard() {
    const mainContent = document.getElementById('main-content');
    mainContent.setAttribute('draggable', "false");
    const cardSpawnBoard = document.getElementById("card-spawn-board");
    let cardSpawns = [];
    for (let i = 0; i < flimCount; i++) {
        const cardSpawn = document.createElement("div");
        cardSpawn.classList.add('cardShape', 'cardSpawn');
        cardSpawnBoard.appendChild(cardSpawn);
        cardSpawns.push(cardSpawn);
    }
    for (let i = 0; i < flimCount; i++) {
        const cardDiv = document.createElement("div");
        let card = new Card(cardDiv, cardSpawns[i], i);
        InitCard(cardDiv, card, filmDetails[i]);
        mainContent.appendChild(cardDiv);
        cards.push(card);
        const rect = card.spawn.getBoundingClientRect();
        setPosition(cardDiv, rect);
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
function moveCardsToWindowResize() {
    for (let card of cards) {
        if (card.placedOn != null) {
            const rect = card.placedOn.element.getBoundingClientRect();
            setPosition(card.element, rect);
        }
        else {
            const rect = card.spawn.getBoundingClientRect();
            setPosition(card.element, rect);
        }
    }
}
function checkCards() {
    var _a;
    if (attemptCount >= maxAttempts) {
        alert("Maximum attempts reached!");
        return;
    }
    let i = 0;
    let allCorrect = true;
    let anyCardPlaced = false;
    for (let a of answer.keys()) {
        if (placements[i].card != null) {
            anyCardPlaced = true;
            if (((_a = placements[i].card) === null || _a === void 0 ? void 0 : _a.id) == a) {
                let correctCard = placements[i].card;
                if (correctCard != null) {
                    correctCard.element.classList.add("correctPlacement");
                    correctCard.correctlyPlaced = true;
                }
            }
            else
                allCorrect = false;
        }
        i++;
    }
    if (!anyCardPlaced) {
        showToast("No card on the board to check!");
        return;
    }
    if (allCorrect) {
        showToast("You WIN!");
        return;
    }
    attemptCount++;
    if (attemptCounterText != null)
        attemptCounterText.innerText = `❤️`.repeat(maxAttempts - attemptCount) + "💔".repeat(attemptCount);
    if (attemptCount >= maxAttempts) {
        showToast("Maximum attempts reached!, You LOSE!");
        return;
    }
}
