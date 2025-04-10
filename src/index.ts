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
  }
];

class Card
{
  isDragging = false;
  offsetX = 0;
  offsetY = 0;
  element : HTMLElement | null = null;
  spawn : HTMLElement | null = null;
  placedOn : HTMLElement | null = null;
  rating = -1;
}

let cards = [] as Card[];
let placements = [] as HTMLElement[];


document.addEventListener('DOMContentLoaded', () => {

  InitBoard();
});

window.addEventListener("resize", function(event)
{
  for(let card of cards)
  {
    if(card.placedOn != null)
    {
      const rect = card.placedOn.getBoundingClientRect();
      if(card.element != null)
      {
        card.element.style.top = rect.top + "px";
        card.element.style.left = rect.left + "px";
      }
    }
    else if(card.spawn != null)
    {
      const rect = card.spawn.getBoundingClientRect();
      if(card.element != null)
      {
        card.element.style.top = rect.top + "px";
        card.element.style.left = rect.left + "px";
      }
    }
  }
});

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

  filmDetails.forEach(film =>{
    const cardPlacement = document.createElement("div")
    cardPlacement.classList.add('cardPlacement');
    board.appendChild(cardPlacement);
    placements.push(cardPlacement);
  });

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
  checkButton.addEventListener("click", () => {
    checkCards();
  });

  const cardSpawnBoard = document.createElement("div");
  cardSpawnBoard.classList.add("cardSpawnBoard");
  mainContent.appendChild(cardSpawnBoard);

  let cardSpawns = [] as HTMLElement[];
  filmDetails.forEach(film =>{
    const cardSpawn = document.createElement("div")
    cardSpawn.classList.add('cardSpawn');
    cardSpawnBoard.appendChild(cardSpawn);
    cardSpawns.push(cardSpawn);
  });

  let i = 0;
  filmDetails.forEach(film => 
    {
    let card = new Card();
    cards.push(card);

    const cardDiv = document.createElement("div")
    InitCard(cardDiv, card, film);
    card.element = cardDiv;
    mainContent.appendChild(cardDiv);

    card.spawn = cardSpawns[i];
    const rect = card.spawn.getBoundingClientRect();
    cardDiv.style.top = rect.top + "px";
    cardDiv.style.left = rect.left + "px";

    i++;
  });
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
  card.rating = filmInfo.rating;

  cardDiv.addEventListener("mousedown", (e: MouseEvent) => {
    card.isDragging = true;
    card.offsetX = e.clientX - cardDiv.offsetLeft;
    card.offsetY = e.clientY - cardDiv.offsetTop;
    cardDiv.style.cursor = "grabbing";
  });
  
  document.addEventListener("mousemove", (e: MouseEvent) => {
    if (card.isDragging) {
      cardDiv.style.left = `${e.clientX - card.offsetX}px`;
      cardDiv.style.top = `${e.clientY - card.offsetY}px`;
    }
  });
  
  document.addEventListener("mouseup", () => {
    card.isDragging = false;
    cardDiv.style.cursor = "grab";

    let isPlaced = false;
    placements.forEach((placement) => {
      const rect = placement.getBoundingClientRect();
      const cardRect = cardDiv.getBoundingClientRect();
      const distance = sqrDistance(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        cardRect.left + cardRect.width / 2,
        cardRect.top + cardRect.height / 2
      );

      if (distance < 3000) {
        cardDiv.style.top = rect.top + "px";
        cardDiv.style.left = rect.left + "px";
        isPlaced = true;
        card.placedOn = placement;
      }
    });

    if (!isPlaced && card.spawn != null) {
      const rect = card.spawn.getBoundingClientRect();
      cardDiv.style.top = rect.top + "px";
      cardDiv.style.left = rect.left + "px";
      card.placedOn = null;
    }
  });

  cardDiv.classList.add('card');

  return cardDiv;
}

function sqrDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

function checkCards()
{
  let allPlaces = true
  for(let a of cards)
  {
    if(a.placedOn === null)
    {
      allPlaces = false;
      break;
    }
  }

  if(!allPlaces)
  {
    alert("Please place all cards before checking!");
    return;
  }
}