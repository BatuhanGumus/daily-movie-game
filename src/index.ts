let filmDetails = [
  {
    title: "Shrek",
    posterSrc: "https://m.media-amazon.com/images/M/MV5BN2FkMTRkNTUtYTI0NC00ZjI4LWI5MzUtMDFmOGY0NmU2OGY1XkEyXkFqcGc@._V1_.jpg",
    rating: 7.9,
  },
  {
    title: "Twilight",
    posterSrc: "https://m.media-amazon.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzEyMTIwMg@@._V1_.jpg",
    rating: 5.3,
  },
  {
    title: "Superbad",
    posterSrc: "https://m.media-amazon.com/images/M/MV5BNjk0MzdlZGEtNTRkOC00ZDRiLWJkYjAtMzUzYTRiNzk1YTViXkEyXkFqcGc@._V1_.jpg",
    rating: 7.6,
  },
  { 
    title: "Perfect Blue",
    posterSrc: "https://m.media-amazon.com/images/M/MV5BMzAwNDIzMzEtZDZkNC00ZDQ4LTk3ZDMtZjVhMTU2YzgzZTZiXkEyXkFqcGc@._V1_.jpg",
    rating: 8.0,
  },
  {
    title: "A Minecraft Movie",
    posterSrc: "https://m.media-amazon.com/images/M/MV5BYzFjMzNjOTktNDBlNy00YWZhLWExYTctZDcxNDA4OWVhOTJjXkEyXkFqcGc@._V1_.jpg",
    rating: 6.0,
  },
];

class Card
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

class Placement
{
  card : Card | null = null;
  element : HTMLElement;

  constructor(element :HTMLElement) {
    this.element = element;
  }
}


let flimCount = filmDetails.length;
let cards = [] as Card[];
let placements = [] as Placement[];

let answer = new Map<number, number>();
let attemptCount = 0;
let maxAttempts = 3;
let attemptCounterText = null as HTMLElement | null;

document.addEventListener('DOMContentLoaded', initGame);
window.addEventListener("resize", moveCardsToWindowResize);


function initGame()
{
  initAnswer();
  InitBoard();
}

function initAnswer()
{
  let i = 0;
  let pullData = new Map<number, number>();
  for(let film of filmDetails)
  {
    pullData.set(i, film.rating);
    i++
  }
  answer = new Map(
    [...pullData.entries()].sort((a, b) => a[1] - b[1])
  );
}

function InitBoard(){

  const mainContent = document.getElementById('main-content') as HTMLElement;
  mainContent.setAttribute('draggable', "false");
  mainContent.classList.add("playArea");

  const board = document.createElement("div");
  board.classList.add("board");
  mainContent.appendChild(board);

  const lowestRatedText = document.createElement("div");
  lowestRatedText.innerText = "Lowest Rated"
  lowestRatedText.classList.add("placementDirectionText");
  board.appendChild(lowestRatedText);

  for(let i = 0; i < flimCount; i++)
  {
    const cardPlacement = document.createElement("div")
    cardPlacement.classList.add('cardPlacement');
    board.appendChild(cardPlacement);

    const placemnt = new Placement(cardPlacement);
    placements.push(placemnt);
  }

  const highestRated = document.createElement("div");
  highestRated.innerText = "Highest Rated"
  highestRated.classList.add("placementDirectionText");
  board.appendChild(highestRated);

  const checkButtonPanel = document.createElement("div");
  checkButtonPanel.classList.add("checkButtonPanel");
  mainContent.appendChild(checkButtonPanel);

  const checkButton = document.createElement("button");
  checkButton.innerText = "Check";
  checkButton.classList.add("checkButton");
  checkButtonPanel.appendChild(checkButton);
  checkButton.addEventListener("click", checkCards);

  attemptCounterText = document.createElement("H2");
  attemptCounterText.innerText = `${attemptCount}/${maxAttempts}`;
  attemptCounterText.classList.add("attemptCounter");
  checkButtonPanel.appendChild(attemptCounterText);

  const cardSpawnBoard = document.createElement("div");
  cardSpawnBoard.classList.add("cardSpawnBoard");
  mainContent.appendChild(cardSpawnBoard);

  let cardSpawns = [] as HTMLElement[];
  for(let i = 0; i < flimCount; i++)
  {
    const cardSpawn = document.createElement("div")
    cardSpawn.classList.add('cardSpawn');
    cardSpawnBoard.appendChild(cardSpawn);
    cardSpawns.push(cardSpawn);
  }

  for(let i = 0; i < flimCount; i++)
  {
      const cardDiv = document.createElement("div")
      let card = new Card(cardDiv, cardSpawns[i], i);
      InitCard(cardDiv, card, filmDetails[i]);
      mainContent.appendChild(cardDiv);
      cards.push(card);

      const rect = card.spawn.getBoundingClientRect();
      setPosition(cardDiv, rect);
  }
}


function  InitCard(cardDiv :HTMLElement, card :Card, filmInfo :any) : HTMLElement
{
  const cardimg = document.createElement("img");
  const cardText = document.createElement('H3');
  cardimg.src = filmInfo.posterSrc;
  cardText.innerHTML = filmInfo.title
  cardimg.setAttribute('draggable', "false");
  cardText.setAttribute('draggable', "false");
  cardDiv.appendChild(cardimg);
  cardDiv.appendChild(cardText);
  cardDiv.classList.add('card');

  cardDiv.addEventListener("mousedown", (e: MouseEvent) => 
  {
    if(card.correctlyPlaced) return;

    card.isDragging = true;
    card.offsetX = e.clientX - cardDiv.offsetLeft;
    card.offsetY = e.clientY - cardDiv.offsetTop;
    cardDiv.style.cursor = "grabbing";
    cardDiv.style.zIndex = "1000";
  });
  
  document.addEventListener("mousemove", (e: MouseEvent) => {
    if (card.isDragging) {
      cardDiv.style.left = `${e.clientX - card.offsetX}px`;
      cardDiv.style.top = `${e.clientY - card.offsetY}px`;
    }
  });
  
  document.addEventListener("mouseup", () => {
    if (!card.isDragging) return;

    card.isDragging = false;
    cardDiv.style.cursor = "grab";
    cardDiv.style.zIndex = "1";

    let isPlaced = false;
    
    const cardRect = cardDiv.getBoundingClientRect();
    for(let placement of placements) {
      const rect = placement.element.getBoundingClientRect();
      const distance = sqrDistance(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        cardRect.left + cardRect.width / 2,
        cardRect.top + cardRect.height / 2
      );

      if (distance < 4000) {
        if(placement.card == null)
          {
          setPosition(cardDiv, rect);
          if(card.placedOn != null) card.placedOn.card = null;
          card.placedOn = placement;
          placement.card = card;
        }
        else
        {
          if(card.placedOn != null) 
          {
            let placedCard = placement.card;
            placedCard.placedOn = card.placedOn;
            if(placedCard.placedOn != null) 
            {
              setPosition(placedCard.element, placedCard.placedOn.element.getBoundingClientRect());
              placedCard.placedOn.card = placedCard;
            }
              
            card.placedOn = placement;
            setPosition(cardDiv, placement.element.getBoundingClientRect());
            placement.card = card;
          }
          else
          {
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

      if(card.placedOn != null) card.placedOn.card = null;
      card.placedOn = null;
    }
  });

  return cardDiv;
}

function sqrDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

function setPosition(element :HTMLElement, rect :DOMRect)
{
  element.style.top = rect.top + "px";
  element.style.left = rect.left + "px";
}

function moveCardsToWindowResize()
{
  for(let card of cards)
    {
      if(card.placedOn != null)
      {
        const rect = card.placedOn.element.getBoundingClientRect();
        setPosition(card.element, rect);
      }
      else
      {
        const rect = card.spawn.getBoundingClientRect();
        setPosition(card.element, rect);
      }
    }
}

function checkCards()
{
  if(attemptCount >= maxAttempts)
  {
    alert("Maximum attempts reached!");
    return;
  }

  for(let a of cards)
  {
    if(a.placedOn == null)
    {
      alert("Please place all cards before checking!");
      return;
    }
  }

  let i = 0;
  let allCorrect = true;
  for(let a of answer.keys())
  {
    if(placements[i].card?.id == a)
    {
      let correctCard = placements[i].card;
      if(correctCard != null)
      {
        correctCard.element.classList.add("correctPlacement");
        correctCard.correctlyPlaced = true;
      }
    }
    else
      allCorrect = false;

    i++;
  }

  attemptCount++;
  if(attemptCounterText != null) 
    attemptCounterText.innerText = `${attemptCount}/${maxAttempts}`;

  if(allCorrect)
  {
    showToast("You WIN!");
    return;
  }
  

  if(attemptCount >= maxAttempts)
  {
    showToast("Maximum attempts reached!, You LOSE!");
    return;
  }
}

function showToast(message: string, duration = 3000) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "40px";
  toast.style.right = "40px";
  toast.style.padding = "30px 40px";
  toast.style.backgroundColor = "#222";
  toast.style.color = "#fff";
  toast.style.fontSize = "1.5rem";
  toast.style.fontWeight = "bold";
  toast.style.borderRadius = "16px";
  toast.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.5s ease, transform 0.3s ease";
  toast.style.transform = "translateY(20px)";

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 500);
  }, duration);
}