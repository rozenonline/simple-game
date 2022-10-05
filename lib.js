let gameStarted = false;
let gameOver = false;
let point = 0;

let jumping = false;
let doneJumping = false;

let playerPosition = { x: 100, y: 250 };
let lastObstacleCreated = Date.now();
let obstacles = [];

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const renderScore = (ctx) => {
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#000";
  ctx.textAlign = "right";
  ctx.fillText(`${point} Point(s)`, 980, 35);
};

const checkHit = () => {
  for (const obstacle of obstacles) {
    if (
      obstacle.x < playerPosition.x + 50 &&
      obstacle.x + 30 > playerPosition.x &&
      obstacle.y < playerPosition.y + 50 &&
      obstacle.y + 30 > playerPosition.y
    ) {
      gameOver = true;
    }
  }
};

const createObstacle = () => {
  if (lastObstacleCreated + 750 <= Date.now()) {
    lastObstacleCreated = Date.now();
    obstacles.push({ x: 1000, y: Math.random() * 2 < 1 ? 270 : 210 });
  }
};

const moveObstacles = () => {
  let speed = 10;
  if (point > 1000) {
    speed = 0.01 * point;
    if (speed > 35) speed = 35;
  }

  for (const obstacle of obstacles) {
    obstacle.x -= speed;
  }

  obstacles = obstacles.filter((o) => o.x > -50);
};

const renderObstacles = (ctx) => {
  for (const obstacle of obstacles) {
    ctx.fillStyle = "#000";
    ctx.fillRect(obstacle.x, obstacle.y, 30, 30);
  }
};

const renderPlayer = (ctx) => {
  ctx.fillStyle = "red";
  ctx.fillRect(playerPosition.x, playerPosition.y, 50, 50);
};

const renderGameStartText = (ctx) => {
  ctx.font = "32px sans-serif";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.fillText("Press spacebar to start game.", 500, 150);
};

const renderGameOverText = (ctx) => {
  ctx.font = "32px sans-serif";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", 500, 150);
};

const jump = () => {
  playerPosition.y += doneJumping ? 7.5 : -7.5;
  if (playerPosition.y < 150) {
    doneJumping = true;
  }
  if (doneJumping && playerPosition.y === 250) {
    jumping = false;
    doneJumping = false;
  }
};

function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    renderGameStartText(ctx);
  }

  if (gameOver) {
    renderGameOverText(ctx);
  }

  renderPlayer(ctx);

  if (gameStarted) {
    if (!gameOver) point++;

    renderScore(ctx);

    if (!gameOver) {
      moveObstacles(ctx);
    }

    renderObstacles(ctx);

    checkHit();

    if (!gameOver) {
      if (Math.ceil(Math.random() * 40) === 1) {
        createObstacle();
      }
    }

    if (jumping) {
      jump();
    }
  }
}

// Jump Keypress
document.addEventListener("keypress", (e) => {
  if (!gameStarted) {
    gameStarted = true;
  } else if (gameOver) {
    jumping = false;
    doneJumping = false;

    playerPosition = { x: 100, y: 250 };
    obstacles.length = 0;
    gameOver = false;
    point = 0;
  } else if (e.keyCode === 32) {
    jumping = true;
  }
});

setInterval(renderGame, 1000 / 60);
