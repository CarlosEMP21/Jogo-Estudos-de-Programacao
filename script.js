// Canvas and Context Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let isGameRunning = false;
let score = 0;
let level = 1;
let robot = { x: 50, y: 300, width: 50, height: 50 };
let target = { x: 700, y: 300, width: 50, height: 50, color: 'green' };

// Load robot image
const robotImage = new Image();
robotImage.src = 'robo.png';

// Control Buttons
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const executeCommandsButton = document.getElementById('executeCommands');
const commandButtons = document.querySelectorAll('.command-btn');
const commandListElement = document.getElementById('command-list');

// Command Queue
let commandQueue = [];

// Game Logic
function drawRobot() {
    ctx.drawImage(robotImage, robot.x, robot.y, robot.width, robot.height);
}

function drawTarget() {
    ctx.fillStyle = target.color;
    ctx.fillRect(target.x, target.y, target.width, target.height);
}

function updateGame() {
    if (!isGameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawRobot();
    drawTarget();

    // Check for completion
    if (
        robot.x < target.x + target.width &&
        robot.x + robot.width > target.x &&
        robot.y < target.y + target.height &&
        robot.y + robot.height > target.y
    ) {
        isGameRunning = false;
        score += 10;
        level++;
        updateInfo();
        alert('Parabéns! Você completou a tarefa!');
    }
}

function updateInfo() {
    document.getElementById('levelInfo').textContent = `Nível: ${level}`;
    document.getElementById('taskInfo').textContent = 'Tarefa: Configure o robô para otimizar a produção.';
    document.getElementById('scoreInfo').textContent = `Pontuação: ${score}`;
}

function startGame() {
    isGameRunning = true;
    robot.x = 50;
    robot.y = 300;
    updateInfo();
    gameLoop();
}

function resetGame() {
    score = 0;
    level = 1;
    robot.x = 50;
    robot.y = 300;
    updateInfo();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRobot();
    drawTarget();
    commandQueue = [];
    commandListElement.textContent = '';
    startGame(); // Automatically start the game after resetting
}

function gameLoop() {
    updateGame();
    if (isGameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Command Execution
function executeCommands() {
    if (!isGameRunning || commandQueue.length === 0) return;

    let command = commandQueue.shift();
    switch (command) {
        case 'Cima':
            robot.y -= 50;
            break;
        case 'Baixo':
            robot.y += 50;
            break;
        case 'Esquerda':
            robot.x -= 50;
            break;
        case 'Direita':
            robot.x += 50;
            break;
    }

    // Restrict movement to canvas boundaries
    if (robot.x < 0) robot.x = 0;
    if (robot.x + robot.width > canvas.width) robot.x = canvas.width - robot.width;
    if (robot.y < 0) robot.y = 0;
    if (robot.y + robot.height > canvas.height) robot.y = canvas.height - robot.height;

    updateGame();

    if (commandQueue.length > 0) {
        setTimeout(executeCommands, 300); // Execute next command after delay
    }
}

// Event Listeners
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
executeCommandsButton.addEventListener('click', executeCommands);

document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;

    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault(); // Evita rolagem da página
    }


    // Restrict movement to canvas boundaries
    if (robot.x < 0) robot.x = 0;
    if (robot.x + robot.width > canvas.width) robot.x = canvas.width - robot.width;
    if (robot.y < 0) robot.y = 0;
    if (robot.y + robot.height > canvas.height) robot.y = canvas.height - robot.height;
});

// Command Button Logic
commandButtons.forEach(button => {
    button.addEventListener('click', () => {
        const command = button.getAttribute('data-command');
        commandQueue.push(command);
        commandListElement.textContent = commandQueue.join(', ');
    });
});

// Ensure the image is loaded before starting
robotImage.onload = () => {
    resetGame();
};

// Game State
let obstacles = [
    { x: 300, y: 250, width: 100, height: 100, color: 'red' },
    { x: 500, y: 300, width: 100, height: 100, color: 'blue' },
    { x: 0, y: 200, width: 100, height: 100, color: 'black' }
];

// Draw Obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Update Game to check collisions with obstacles
function updateGame() {
    if (!isGameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawRobot();
    drawTarget();
    drawObstacles();

    // Check for completion
    if (
        robot.x < target.x + target.width &&
        robot.x + robot.width > target.x &&
        robot.y < target.y + target.height &&
        robot.y + robot.height > target.y
    ) {
        isGameRunning = false;
        score += 10;
        level++;
        updateInfo();
        alert('Parabéns! Você completou a tarefa!');
    }

    // Check for collision with obstacles
    obstacles.forEach(obstacle => {
        if (
            robot.x < obstacle.x + obstacle.width &&
            robot.x + robot.width > obstacle.x &&
            robot.y < obstacle.y + obstacle.height &&
            robot.y + robot.height > obstacle.y
        ) {
            isGameRunning = false;
            alert('Você bateu em um obstáculo! Tente novamente.');
            resetGame(); // Reset the game
        }
    });
}


