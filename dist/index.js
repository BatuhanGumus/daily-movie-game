var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { collections } from './database.js';
import { rectDistance, setPosition, showToast, vw, wait } from './util.js';
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
let checkButton = null;
let checkingAnswers = false;
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
    checkButton = document.getElementById("check-button");
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
        if (card.correctlyPlaced || checkingAnswers)
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
    return __awaiter(this, void 0, void 0, function* () {
        if (checkingAnswers)
            return;
        if (attemptCount >= maxAttempts) {
            alert("Maximum attempts reached!");
            return;
        }
        checkButton === null || checkButton === void 0 ? void 0 : checkButton.classList.add("disabled");
        checkingAnswers = true;
        let i = 0;
        let allCorrect = true;
        let anyCardPlaced = false;
        for (let a of answer.keys()) {
            let placement = answerPlacements[i];
            if (placement.cardOnIt != null) {
                if (placement.cardOnIt.correctlyPlaced == false) {
                    if (placement.cardOnIt.id === a) {
                        yield wait(placement.cardOnIt.correct() * 0.8);
                    }
                    else {
                        allCorrect = false;
                        yield wait(placement.cardOnIt.incorrect() * 0.8);
                    }
                    anyCardPlaced = true;
                }
            }
            else {
                allCorrect = false;
            }
            i++;
        }
        checkButton === null || checkButton === void 0 ? void 0 : checkButton.classList.remove("disabled");
        checkingAnswers = false;
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
    });
}
