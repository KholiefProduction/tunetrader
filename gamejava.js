        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 800;
        canvas.height = 600;

        const keys = {
            right: false,
            left: false,
            up: false,
            down: false
        };

        let score = 0; // Variable to track the score
        let coinsCollected = 0; // Variable to track collected coins
        let hasCollided = false; // Variable to track whether the player has collided
        const obstacles = []; // Array to store obstacles
        const coins = []; // Array to store coins

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' && !keys.left) keys.right = true;
            if (e.key === 'ArrowLeft' && !keys.right) keys.left = true;
            if (e.key === 'ArrowUp' && !keys.down) keys.up = true;
            if (e.key === 'ArrowDown' && !keys.up) keys.down = true;
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight') keys.right = false;
            if (e.key === 'ArrowLeft') keys.left = false;
            if (e.key === 'ArrowUp') keys.up = false;
            if (e.key === 'ArrowDown') keys.down = false;
        });

        const player = {
            x: 50,
            y: 50,
            width: 20,
            height: 20,
            speed: 3, // Decreased speed
            color: getRandomColor(),  // Initial color of the player
            blocks: [],  // Array to store blocks
            rotation: 0  // Initial rotation
        };

        const rectangle = {
            x: 100,
            y: 400,
            width: 100,  // Make the rectangle long
            height: 20,
            color: 'green',
            speed: 1  // Slowed down speed
        };

        function drawPlayer() {
            ctx.save();
            ctx.fillStyle = player.color; // Updated to use player's current color
            ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
            ctx.rotate(player.rotation);
            ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
            ctx.restore();
            player.blocks.forEach(block => {
                ctx.fillStyle = player.color;
                ctx.fillRect(block.x, block.y, player.width, player.height);
            });
        }

        function drawRectangle() {
            ctx.fillStyle = rectangle.color;
            ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }

        function drawObstacles() {
            obstacles.forEach(obstacle => {
                ctx.fillStyle = obstacle.color;
                if (obstacle.shape === 'rectangle') {
                    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                } else if (obstacle.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(obstacle.x, obstacle.y, obstacle.width / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        }

        function drawCoins() {
            coins.forEach(coin => {
                ctx.fillStyle = coin.color;
                ctx.beginPath();
                ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        function updatePlayer() {
            if (keys.right && player.x + player.width < canvas.width) {
                player.rotation = 0;
                player.x += player.speed;
            }
            if (keys.left && player.x > 0) {
                player.rotation = Math.PI;
                player.x -= player.speed;
            }
            if (keys.up && player.y > 0) {
                player.rotation = -Math.PI / 2;
                player.y -= player.speed;
			}
			            if (keys.down && player.y + player.height < canvas.height) {
                player.rotation = Math.PI / 2;
                player.y += player.speed;
            }
            let newX = player.x;
            let newY = player.y;
            player.blocks.unshift({x: newX, y: newY});
            if (player.blocks.length > score + 1) player.blocks.pop();
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
        }

function checkCollision() {
    if (!hasCollided && player.x < rectangle.x + rectangle.width &&
        player.x + player.width > rectangle.x &&
        player.y < rectangle.y + rectangle.height &&
        player.y + player.height > rectangle.y) {
            score++; // Increment score
            document.getElementById('scoreboard').innerText = 'Score: ' + score; // Update scoreboard
            player.color = getRandomColor(); // Change player color
            hasCollided = true; // Set collision flag
            player.blocks.push({ x: player.x, y: player.y }); // Add block to player's body
            if (score % 3 === 0) addObstacle(); // Add a new obstacle every 3 points
    }

    obstacles.forEach(obstacle => {
        if (obstacle.shape === 'rectangle') {
            if (player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y) {
                    resetGame(); // Reset the game if the player touches an obstacle
            }
        } else if (obstacle.shape === 'circle') {
            const dx = player.x + player.width / 2 - obstacle.x;
            const dy = player.y + player.height / 2 - obstacle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < obstacle.width / 2 + player.width / 2) {
                resetGame(); // Reset the game if the player touches a circular obstacle
            }
        }
    });

    coins.forEach((coin, index) => {
        const dx = player.x + player.width / 2 - coin.x;
        const dy = player.y + player.height / 2 - coin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < coin.radius + player.width / 2) {
            coinsCollected++;
            coins.splice(index, 1);
            document.getElementById('coinCounter').innerText = 'Coins: ' + coinsCollected;
        }
    });
}


        function moveRectangle() {
            rectangle.x += (Math.random() * 2 - 1) * rectangle.speed;
            rectangle.y += (Math.random() * 2 - 1) * rectangle.speed;

            // Keep the rectangle within the game container
            if (rectangle.x < 0) rectangle.x = 0;
            if (rectangle.x + rectangle.width > canvas.width) rectangle.x = canvas.width - rectangle.width;
            if (rectangle.y < 0) rectangle.y = 0;
            if (rectangle.y + rectangle.height > canvas.height) rectangle.y = canvas.height - rectangle.height;
        }

        setInterval(() => {
            rectangle.x = Math.random() * (canvas.width - rectangle.width);
            rectangle.y = Math.random() * (canvas.height - rectangle.height);
            hasCollided = false; // Reset collision flag
        }, 2000);

        setInterval(addCoin, Math.random() * 10000 + 10000); // Coins spawn between 10 and 20 seconds

        function gameLoop() {
            clearCanvas();
            drawPlayer();
            drawRectangle();
            drawObstacles();
            drawCoins();
            updatePlayer();
            checkCollision();
            moveRectangle();
            requestAnimationFrame(gameLoop);
        }

        gameLoop();

        // Function to generate random color
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        // Function to reset the game
        function resetGame() {
            window.location.href = "retry.html";
        }

        // Function to add new obstacle
        function addObstacle() {
            const shape = Math.random() < 0.5 ? 'rectangle' : 'circle';
            const size = Math.random() * 30 + 20;
            const obstacle = {
                x: Math.random() * (canvas.width - size),
                y: Math.random() * (canvas.height - size),
                width: size,
                height: size,
                color: 'red',  // All obstacles are red
                shape: shape
            };
            obstacles.push(obstacle);
        }

        // Function to add new coin
        function addCoin() {
            const radius = Math.random() * 10 + 5;
            const x = Math.random() * (canvas.width - radius * 2) + radius;
            const y = Math.random() * (canvas.height - radius * 2) + radius;
            const color = 'gold';
            coins.push({ x, y, radius,
            color });
        }