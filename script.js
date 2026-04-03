
const GOAL_CANS = 10;
let score = 0;
let gameActive = false;
let spawnInterval;

const scoreDisplay = document.getElementById('score');
const message = document.getElementById('message');
const grid = document.querySelector('.game-grid');

function createGrid() {
  grid.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';

    // Add click handler
    cell.addEventListener('click', () => handleClick(cell));

    grid.appendChild(cell);
  }
}

// Run on load
createGrid();

function spawnItem() {
  if (!gameActive) return;

  const cells = document.querySelectorAll('.grid-cell');

  // Clear grid
  cells.forEach(cell => {
    cell.innerHTML = '';
    cell.dataset.type = '';
  });

  // Pick random cell
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // 30% chance obstacle
  const isObstacle = Math.random() < 0.3;

  if (isObstacle) {
    randomCell.innerHTML = `<div class="obstacle"></div>`;
    randomCell.dataset.type = "obstacle";
  } else {
    randomCell.innerHTML = `<div class="water-can"></div>`;
    randomCell.dataset.type = "can";
  }
}

function handleClick(cell) {
  if (!gameActive || !cell.dataset.type) return;

  if (cell.dataset.type === "can") {
    score++;
    flash(cell, "correct");
  } else {
    score = Math.max(0, score - 1);
    flash(cell, "wrong");
  }

  // Update score display
  scoreDisplay.textContent = score;

  // Clear clicked item
  cell.innerHTML = '';
  cell.dataset.type = '';

 
  if (score >= GOAL_CANS) {
    winGame();
  }
}

function flash(cell, className) {
  cell.classList.add(className);
  setTimeout(() => {
    cell.classList.remove(className);
  }, 200);
}

function startGame() {
  if (gameActive) return;

  gameActive = true;
  score = 0;
  scoreDisplay.textContent = score;
  message.textContent = '';

  createGrid();

  spawnInterval = setInterval(spawnItem, 800);
}

function endGame() {
  gameActive = false;
  clearInterval(spawnInterval);
}

function resetGame() {
  endGame();

  score = 0;
  scoreDisplay.textContent = score;
  message.textContent = '';

  createGrid();
}

function winGame() {
  endGame();
  message.textContent = "You win! 🎉";
  launchConfetti();
}

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 3 + 2
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.y += p.speed;

      if (p.y > canvas.height) {
        p.y = 0;
        p.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(update);
  }

  update();

  // Stop after 3 seconds
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 3000);
}

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);
