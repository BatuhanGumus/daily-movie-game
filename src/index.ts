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
}

let cards = [];

const mainContent = document.getElementById('main-content') as HTMLElement;
mainContent.setAttribute('draggable', "false");

document.addEventListener('DOMContentLoaded', () => {

  InitBoard();
  SpawnCards();
});

function InitBoard()
{
  const cardPlacement1 = document.createElement("div")
  cardPlacement1.classList.add('cardPlacement');
  mainContent.appendChild(cardPlacement1);
}

function SpawnCards()
{
  filmDetails.forEach(film => 
    {
    let card = new Card();
    cards.push(card);

    const cardDiv = document.createElement("div")
    InitCard(cardDiv, card, film);
    mainContent.appendChild(cardDiv);
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
  });

  cardDiv.classList.add('card');

  return cardDiv;
}