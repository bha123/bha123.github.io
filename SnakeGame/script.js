const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const topScoreDisplay = document.getElementById('topScore');
const speedSelect = document.getElementById('speed');

const box = 20;
const canvasSize = 400;
const rows = canvasSize / box;
const cols = canvasSize / box;

let snake = [{ x: 9 * box, y: 10 * box }];
let direction = 'RIGHT';
let food = {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box
};
let score = 0;
let topScore = localStorage.getItem('topScore') || 0;
topScoreDisplay.textContent = 'Top Score: ' + topScore;
let game;
let speed = parseInt(speedSelect.value);
let gameOver = false;

document.addEventListener('keydown', changeDirection);
document.getElementById('restartButton').addEventListener('click', restartGame);
speedSelect.addEventListener('change', changeSpeed);

function changeDirection(event) {
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = '#0f0';
        ctx.strokeStyle = '#0f0';
        drawRoundedRect(snake[i].x, snake[i].y, box, box, 5);
    }

    ctx.fillStyle = '#0f0';
    ctx.strokeStyle = '#0f0';
    drawRoundedRect(food.x, food.y, box, box, 5);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * cols) * box,
            y: Math.floor(Math.random() * rows) * box
        };
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        clearInterval(game);
        if (score > topScore) {
            topScore = score;
            localStorage.setItem('topScore', topScore);
            topScoreDisplay.textContent = 'Top Score: ' + topScore;
        }
        gameOver = true;
    }

    snake.unshift(newHead);

    if (gameOver) {
        ctx.fillStyle = '#0f0';
        ctx.font = '30px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvasSize / 2, canvasSize / 2);
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function restartGame() {
    clearInterval(game);
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = 'RIGHT';
    food = {
        x: Math.floor(Math.random() * cols) * box,
        y: Math.floor(Math.random() * rows) * box
    };
    score = 0;
    scoreDisplay.textContent = 'Score: ' + score;
    gameOver = false;
    speed = parseInt(speedSelect.value);
    game = setInterval(draw, speed);
}

function changeSpeed() {
    speed = parseInt(speedSelect.value);
    clearInterval(game);
    game = setInterval(draw, speed);
}

game = setInterval(draw, speed);cd /Users/bharathposa/Desktop/workspace/projects/ai_crews
