const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const pontuacao = document.getElementById("score")


const ROW = 20
const COL = COLUMN = 10;
const SQ = SQUARESIZE = 20;
const VACANT = "WHITE"



function drawSquare(x, y, color) {
    ctx.fillStyle = color
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ)
    ctx.strokeStyle = "black"
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ)
}

//criando o board
let board = []
for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

function drawBoard() {
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c])
        }
    }
}

drawBoard();

const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

//Gerando tetris randomicos
function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length)
    return new Piece(PIECES[r][0], PIECES[r][1])
}
let p = randomPiece()

//Objeto Piece
function Piece(tetromino, color) {
    this.tetromino = tetromino
    this.color = color

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 4
    this.y = -1


}

Piece.prototype.fill = function (color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color)
            }
        }
    }
}

Piece.prototype.draw = function () {
    this.fill(this.color)
}

Piece.prototype.unDraw = function () {
    this.fill(VACANT)
}


//Mover para baixo automaticamente
Piece.prototype.moveDown = function () {
    if (!this.collisions(0, 1, this.activeTetromino)) {
        this.unDraw()
        this.y++
        this.draw()
    } else {
        this.lock()
        p = randomPiece()
    }
}

//Mover para direita
Piece.prototype.moveRight = function () {
    if (!this.collisions(1, 0, this.activeTetromino)) {
        this.unDraw()
        this.x++
        this.draw()
    }
}
//Mover para esquerda
Piece.prototype.moveLeft = function () {
    if (!this.collisions(-1, 0, this.activeTetromino)) {
        this.unDraw()
        this.x--
        this.draw()
    }
}
//Rotacionar o tetris
Piece.prototype.rotation = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length]
    let kick = 0

    if (this.collisions(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            kick = -1
        } else {
            kick = 1
        }
    }

    if (!this.collisions(kick, 0, nextPattern)) {
        this.unDraw()
        this.x += kick
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length
        this.activeTetromino = this.tetromino[this.tetrominoN]
        this.draw()
    }
}

let score = 0

Piece.prototype.lock = function () {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue
            }
            if (this.y + r < 0) {
                alert("Game Over   \nPontuação: "+score)
                gameOver = true;
                break;
            }
            board[this.y + r][this.x + c] = this.color
        }
    }
    for (r = 0; r < ROW; r++) {
        let isRowFUll = true
        for (c = 0; c < COL; c++) {
            isRowFUll = isRowFUll && (board[r][c] != VACANT)
        }
        if (isRowFUll) {
            for (y = r; y > 1; y--) {
                for (c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c]
                }
            }

            for (c = 0; c < COL; c++) {
                board[0][c] = VACANT
            }
            score += 100
        }
    }

    drawBoard()

    //atualizar pontuação
    pontuacao.innerHTML = score;
}

//Colisões
Piece.prototype.collisions = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            //verifica se está vazio
            if (!piece[r][c]) {
                continue;
            }

            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            if (newY < 0) {
                continue;
            }
            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}
//Controles
document.addEventListener("keydown", CONTROL)

function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveLeft()
        dropStart = Date.now()
    } else if (event.keyCode == 38) {
        p.rotation()
        dropStart = Date.now()
    } else if (event.keyCode == 39) {
        p.moveRight()
        dropStart = Date.now()
    } else if (event.keyCode == 40) {
        p.moveDown()
        dropStart = Date.now()
    }
}


let dropStart = Date.now()
let gameOver = false

function drop() {
    let now = Date.now()
    let delta = now - dropStart
    if (delta > 800) {
        p.moveDown()
        dropStart = Date.now()
    }
    if (!gameOver)
        requestAnimationFrame(drop)
        
    if (gameOver) {
        location.reload()
    }
}

drop()



 
