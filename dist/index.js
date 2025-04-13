import { collections } from './database.js';
import { rectDistance, setPosition, showToast, vw } from './util.js';
import { Card, Placement } from './definitions.js';
let todaysSet;
let setSize = 0;
let cards = [];
let answerPlacements = [];
let spawnPlacement = [];
let allPlacements = [];
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
    const topicCollection = collections.filmsByRating;
    const random = Math.floor(Math.random() * topicCollection.length);
    todaysSet = topicCollection[random];
    setSize = todaysSet.length;
    let i = 0;
    let pullData = new Map();
    for (let setItem of todaysSet) {
        pullData.set(i, setItem.sortValue);
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
    document.getElementById("lowest-text").innerText = "Lowest\nRated";
    document.getElementById("highest-text").innerText = "Highest\nRated";
    for (let i = 0; i < setSize; i++) {
        const cardPlacement = document.createElement("div");
        cardPlacement.classList.add('card-shape', 'card-placement', 'three-dimensional', 'hole');
        placementParent.appendChild(cardPlacement);
        const placemnt = new Placement(cardPlacement);
        answerPlacements.push(placemnt);
        allPlacements.push(placemnt);
    }
}
function InitCheckBoard() {
    attemptCounterText = document.getElementById("attempt-counter");
    attemptCounterText.innerText = `❤️`.repeat(maxAttempts);
    document.getElementById("check-button").addEventListener("click", checkCards);
}
function InitSpawnBoard() {
    const mainContent = document.getElementById('main-content');
    const cardSpawnBoard = document.getElementById("card-spawn-board");
    for (let i = 0; i < setSize; i++) {
        const cardSpawn = document.createElement("div");
        cardSpawn.classList.add('card-shape', 'card-spawn');
        cardSpawnBoard.appendChild(cardSpawn);
        const placemnt = new Placement(cardSpawn);
        spawnPlacement.push(placemnt);
        allPlacements.push(placemnt);
    }
    for (let i = 0; i < setSize; i++) {
        let card = new Card(todaysSet[i], spawnPlacement[i], i);
        InitCard(card);
        mainContent.appendChild(card.element);
        cards.push(card);
        setPosition(card.element, card.placedOn.rect());
    }
}
function InitCard(card) {
    card.element.addEventListener("pointerdown", (e) => {
        if (card.correctlyPlaced)
            return;
        card.isDragging = true;
        card.offsetX = e.clientX - card.element.offsetLeft;
        card.offsetY = e.clientY - card.element.offsetTop;
        card.element.style.cursor = "grabbing";
        card.element.style.zIndex = "1000";
    });
    document.addEventListener("pointermove", (e) => {
        if (card.isDragging) {
            card.element.style.left = `${e.clientX - card.offsetX}px`;
            card.element.style.top = `${e.clientY - card.offsetY}px`;
        }
    });
    document.addEventListener("pointerup", () => {
        if (!card.isDragging)
            return;
        card.isDragging = false;
        card.element.style.cursor = "grab";
        card.element.style.zIndex = "1";
        const cardRect = card.rect();
        for (let placement of allPlacements) {
            const placementRect = placement.rect();
            const distance = rectDistance(cardRect, placementRect);
            if (distance < vw(5)) {
                if (placement.cardOnIt == null) {
                    card.placedOn.cardOnIt = null;
                    card.placedOn = placement;
                    placement.cardOnIt = card;
                    card.MoveToPlaced();
                }
                else {
                    if (placement.cardOnIt.correctlyPlaced) {
                        card.MoveToPlaced();
                    }
                    else {
                        placement.cardOnIt.placedOn = card.placedOn;
                        card.placedOn.cardOnIt = placement.cardOnIt;
                        placement.cardOnIt.MoveToPlaced();
                        card.placedOn = placement;
                        placement.cardOnIt = card;
                        card.MoveToPlaced();
                    }
                }
            }
            else {
                card.MoveToPlaced();
            }
        }
    });
}
function moveCardsToWindowResize() {
    for (let card of cards) {
        setPosition(card.element, card.placedOn.rect());
    }
}
function checkCards() {
    var _a, _b;
    if (attemptCount >= maxAttempts) {
        alert("Maximum attempts reached!");
        return;
    }
    let i = 0;
    let allCorrect = true;
    let anyCardPlaced = false;
    for (let a of answer.keys()) {
        if (answerPlacements[i].cardOnIt != null) {
            if (!((_a = answerPlacements[i].cardOnIt) === null || _a === void 0 ? void 0 : _a.correctlyPlaced))
                anyCardPlaced = true;
            if (((_b = answerPlacements[i].cardOnIt) === null || _b === void 0 ? void 0 : _b.id) == a) {
                let correctCard = answerPlacements[i].cardOnIt;
                if (correctCard != null) {
                    correctCard.element.classList.add("correct-placement");
                    correctCard.correctlyPlaced = true;
                }
            }
            else
                allCorrect = false;
        }
        else
            allCorrect = false;
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
        attemptCounterText.innerText = `❤️`.repeat(maxAttempts - attemptCount) + "🖤".repeat(attemptCount);
    if (attemptCount >= maxAttempts) {
        showToast("Maximum attempts reached!, You LOSE!");
        return;
    }
}
