const gameContainer = document.querySelector('.game-container');
const jumper = document.querySelector('.jumper');

let platforms = [];
let jumperBottom = 150; // Initial jumper position
let jumperLeft = 185; // Center of the screen
let gravity = 2;
let isJumping = false;
let jumpSpeed = 20;
let fallSpeed = 5;
let gameInterval;

// Platform generator
class Platform {
  constructor(bottom) {
    this.bottom = bottom;
    this.left = Math.random() * 320; // Random horizontal position
    this.visual = document.createElement('div');

    const visual = this.visual;
    visual.classList.add('platform');
    visual.style.left = `${this.left}px`;
    visual.style.bottom = `${this.bottom}px`;
    gameContainer.appendChild(visual);
  }
}

// Start game
function startGame() {
  createPlatforms();
  movePlatforms();
  gameInterval = setInterval(gameLoop, 20);
}

// Create platforms
function createPlatforms() {
  for (let i = 0; i < 5; i++) {
    let platformGap = 600 / 5;
    let platformBottom = i * platformGap;
    let newPlatform = new Platform(platformBottom);
    platforms.push(newPlatform);
  }
}

// Move platforms
function movePlatforms() {
  setInterval(() => {
    platforms.forEach((platform) => {
      platform.bottom -= 4; // Move platforms down
      const visual = platform.visual;
      visual.style.bottom = `${platform.bottom}px`;

      // Remove platforms that go off-screen and add new ones
      if (platform.bottom < 0) {
        const firstPlatform = platforms[0].visual;
        firstPlatform.remove();
        platforms.shift();
        const newPlatform = new Platform(600);
        platforms.push(newPlatform);
      }
    });
  }, 30);
}

// Jump function
function jump() {
  clearInterval(gameInterval);
  isJumping = true;

  let jumpCount = 0;
  const upInterval = setInterval(() => {
    jumperBottom += jumpSpeed;
    jumper.style.bottom = `${jumperBottom}px`;

    jumpCount++;
    if (jumpCount > 15) {
      clearInterval(upInterval);
      isJumping = false;
      fall();
    }
  }, 20);
}

// Fall function
function fall() {
  if (!isJumping) {
    gameInterval = setInterval(() => {
      jumperBottom -= fallSpeed;
      jumper.style.bottom = `${jumperBottom}px`;

      // Game over if the jumper falls below the screen
      if (jumperBottom <= 0) {
        clearInterval(gameInterval);
        alert('Game Over!');
      }

      // Check for collision with platforms
      platforms.forEach((platform) => {
        if (
          jumperBottom >= platform.bottom &&
          jumperBottom <= platform.bottom + 10 &&
          jumperLeft + 30 >= platform.left &&
          jumperLeft <= platform.left + 80 &&
          !isJumping
        ) {
          jump();
        }
      });
    }, 20);
  }
}

// Game loop
function gameLoop() {
  fall();
}

// Controls
function control(e) {
  if (e.key === 'ArrowLeft') {
    jumperLeft -= 10;
    jumper.style.left = `${jumperLeft}px`;
  } else if (e.key === 'ArrowRight') {
    jumperLeft += 10;
    jumper.style.left = `${jumperLeft}px`;
  } else if (e.key === 'ArrowUp') {
    jump();
  }
}

// Start game on load
startGame();
document.addEventListener('keydown', control);
