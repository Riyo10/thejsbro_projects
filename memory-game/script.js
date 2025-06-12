const board = document.getElementById('game-board');
const restartBtn = document.getElementById('restart');

const emojis = ['🍎', '🍕', '🎈', '🐶', '🚗', '⚽', '🎵', '🌟'];
let cards = [...emojis, ...emojis]; // Duplicate to make pairs
let firstCard, secondCard;
let lockBoard = false;

// Shuffle cards
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  shuffle(cards);
  board.innerHTML = '';
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.innerText = '?';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.innerText = this.dataset.emoji;
  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetTurn();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.innerText = '?';
      secondCard.innerText = '?';
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

restartBtn.addEventListener('click', createBoard);

// Initial load
createBoard();
