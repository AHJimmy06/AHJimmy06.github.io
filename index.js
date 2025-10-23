const canvas = document.getElementById('maze-canvas');
const ctx = canvas.getContext('2d');

// Maze dimensions
const mazeWidth = 20;
const mazeHeight = 20;
const cellSize = 20;

canvas.width = mazeWidth * cellSize;
canvas.height = mazeHeight * cellSize;

// Maze data (1 = wall, 0 = path)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Player position
let player = { x: 1, y: 1 };
let solution = null;

function drawMaze() {
    for (let y = 0; y < mazeHeight; y++) {
        for (let x = 0; x < mazeWidth; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

function solveMaze() {
    const start = { x: 1, y: 1 };
    const end = { x: 18, y: 18 };

    const queue = [[start]];
    const visited = new Set([`${start.x},${start.y}`]);

    while (queue.length > 0) {
        const path = queue.shift();
        const { x, y } = path[path.length - 1];

        if (x === end.x && y === end.y) {
            solution = path;
            return;
        }

        const neighbors = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 },
        ];

        for (const neighbor of neighbors) {
            const { x: nx, y: ny } = neighbor;
            if (
                nx >= 0 && nx < mazeWidth &&
                ny >= 0 && ny < mazeHeight &&
                maze[ny][nx] === 0 &&
                !visited.has(`${nx},${ny}`)
            ) {
                visited.add(`${nx},${ny}`);
                const newPath = [...path, neighbor];
                queue.push(newPath);
            }
        }
    }
}

function drawSolution() {
    if (solution) {
        ctx.fillStyle = 'yellow';
        for (const { x, y } of solution) {
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function redraw() {
    clearCanvas();
    drawMaze();
    if (solution) {
        drawSolution();
    }
    drawPlayer();
}

document.addEventListener('keydown', (event) => {
    const newPlayer = { ...player };
    switch (event.key) {
        case 'ArrowUp':
            newPlayer.y--;
            break;
        case 'ArrowDown':
            newPlayer.y++;
            break;
        case 'ArrowLeft':
            newPlayer.x--;
            break;
        case 'ArrowRight':
            newPlayer.x++;
            break;
    }

    if (maze[newPlayer.y] && maze[newPlayer.y][newPlayer.x] === 0) {
        player = newPlayer;
        redraw();
    }
});



redraw();