import { collections } from './database.js';
import { rectDistance, setPosition, AnimateToPosition, showToast, vw, wait } from './util.js';
import { Card, Placement } from './definitions.js';

let allTopicButtons = new Map<string, HTMLElement>();

let todaysSet: any[]
let setSize = 0;
let cards = [] as Card[];
let answerPlacements = [] as Placement[];
let spawnPlacement = [] as Placement[];
let allPlacements = [] as Placement[];

let answer = new Map<number, number>();
let attemptCount = 0;
let maxAttempts = 3;

let attemptCounterText = null as HTMLElement | null;
let checkButton = null as HTMLElement | null;
let checkingAnswers = false;
let sortTopic = "";

document.addEventListener('DOMContentLoaded', initGame);
window.addEventListener("resize", moveCardsToWindowResize);

function clearPlayArea()
{
  for (let card of cards) {
    card.element.remove();
  }
  cards = [];
  for (let placement of allPlacements) {
    placement.element.remove();
  }
  allPlacements = [];
  answerPlacements = [];
  spawnPlacement = [];

  attemptCount = 0;
}

function initGame() {
  initTopics();
  initAnswer("filmsByRating");
  InitPlayArea();
}

function initTopics()
{
  const topicMenu = document.getElementById('sort-topic-menu') as HTMLElement;
  let hasSetSelectedTopic = false;
  for(let collectionKey in collections) 
  {
    const button = document.createElement('button');
    if(hasSetSelectedTopic == false) {
      button.classList.add('selected');
      hasSetSelectedTopic = true;
    }
    button.textContent = collections[collectionKey as keyof typeof collections].topic;
    button.addEventListener("click", () => setTopic(collectionKey));
    topicMenu.appendChild(button);
    allTopicButtons.set(collectionKey, button);
  }
}

function setTopic(topic :string)
{
  for(let button of allTopicButtons.values()) {
    button.classList.remove('selected');
  }

  allTopicButtons.get(topic)?.classList.add('selected');
}

function initAnswer(fromTopic :string) {
  const topicCollection = collections[fromTopic as keyof typeof collections];
  const collection = topicCollection.collection;
  const random = Math.floor(Math.random() * collection.length);
  todaysSet = collection[random];
  setSize = todaysSet.length;
  sortTopic = topicCollection.comparisonType;

  let i = 0;
  let pullData = new Map<number, number>();
  for (let setItem of todaysSet) {
    pullData.set(i, setItem.sortValue);
    i++
  }
  answer = new Map(
    [...pullData.entries()].sort((a, b) => a[1] - b[1])
  );
}

function InitPlayArea() {

  InitPlacementBoard();
  InitCheckBoard();
  InitSpawnBoard();
}

function InitPlacementBoard() {
  const placementParent = document.getElementById("placement-parent") as HTMLElement;
  (document.getElementById("lowest-text") as HTMLElement).innerText = `Lowest\n${sortTopic}`;
  (document.getElementById("highest-text") as HTMLElement).innerText = `Highest\n${sortTopic}`;

  for (let i = 0; i < setSize; i++) {
    const cardPlacement = document.createElement("div")
    cardPlacement.classList.add('card-shape', 'card-placement', 'three-dimensional', 'hole');
    placementParent.appendChild(cardPlacement);

    const placemnt = new Placement(cardPlacement);
    answerPlacements.push(placemnt);
    allPlacements.push(placemnt);
  }
}

function InitCheckBoard() {
  checkButton = document.getElementById("check-button") as HTMLElement;
  attemptCounterText = document.getElementById("attempt-counter") as HTMLElement;
  attemptCounterText.innerText = `❤️`.repeat(maxAttempts);
  (document.getElementById("check-button") as HTMLElement).addEventListener("click", checkCards);
}

function InitSpawnBoard() {
  const mainContent = document.getElementById('main-content') as HTMLElement;
  const cardSpawnBoard = document.getElementById("card-spawn-board") as HTMLElement;

  for (let i = 0; i < setSize; i++) {
    const cardSpawn = document.createElement("div")
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

function InitCard(card: Card) {
  card.element.addEventListener("pointerdown", (e: MouseEvent) => {
    if (card.correctlyPlaced || checkingAnswers) return;

    card.isDragging = true;
    card.offsetX = e.clientX - card.element.offsetLeft;
    card.offsetY = e.clientY - card.element.offsetTop;
    card.element.style.cursor = "grabbing";
    card.element.style.zIndex = "1000";
  });

  document.addEventListener("pointermove", (e: MouseEvent) => {
    if (card.isDragging) {
      card.element.style.left = `${e.clientX - card.offsetX}px`;
      card.element.style.top = `${e.clientY - card.offsetY}px`;
    }
  });

  document.addEventListener("pointerup", () => {
    if (!card.isDragging) return;

    card.isDragging = false;
    card.element.style.cursor = "grab";
    card.element.style.zIndex = "1";

    const cardRect = card.rect();
    let placed = false;

    for (let placement of allPlacements) {
      const placementRect = placement.rect();
      const distance = rectDistance(cardRect, placementRect);

      if (distance < vw(5)) {
        if (placement.cardOnIt == null) {
          card.placedOn.cardOnIt = null
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
        placed = true;
      }
    }

    if (!placed) {
      if(answerPlacements.includes(card.placedOn)) 
      {
        let closest = getClosestEmptyPlacement(card, spawnPlacement);
        if(closest !== null)
        {
          card.placedOn.cardOnIt = null;
          card.placedOn = closest;
          closest.cardOnIt = card;
          card.MoveToPlaced();
        }
        else
          card.MoveToPlaced();
      }
      else
        card.MoveToPlaced();
    }
  });
}

function moveCardsToWindowResize() {
  for (let card of cards) {
    setPosition(card.element, card.placedOn.rect());
  }
}



async function checkCards() {
  if (checkingAnswers) return;

  if (attemptCount >= maxAttempts) {
    alert("Maximum attempts reached!");
    return;
  }

  checkButton?.classList.add("disabled");
  checkingAnswers = true;

  let i = 0;
  let allCorrect = true;
  let anyCardPlaced = false;

  for (let a of answer.keys()) {
    let placement = answerPlacements[i];

    if (placement.cardOnIt != null) {
      if (placement.cardOnIt.correctlyPlaced == false) {
        if (placement.cardOnIt.id === a) {
          await wait(placement.cardOnIt.correct() * 0.8);
        }
        else {
          allCorrect = false;
          await wait(placement.cardOnIt.incorrect() * 0.8);
        }
        anyCardPlaced = true;
      }
    }
    else {
      allCorrect = false;
    }

    i++;
  }

  checkButton?.classList.remove("disabled");
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
}

function getClosestEmptyPlacement(card: Card, placements: Placement[]): Placement | null {
  let closest: Placement | null = null;
  let minDistance = Infinity;

  for (const placement of placements) {
    if( placement.cardOnIt != null) continue;
    let distance = rectDistance(card.rect(), placement.rect());

    if (distance < minDistance) {
      minDistance = distance;
      closest = placement;
    }
  }

  return closest;
}