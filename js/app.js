const btnNo = document.getElementById('btnNo');
const btnGo = document.getElementById('btnGo');
const pantallaInvitacion = document.getElementById('invitacion');
const pantallaJuego = document.getElementById('pantalla-juego');
const pantallaSnake = document.getElementById('pantalla-snake');
const pantallaResultado = document.getElementById('resultado');

// 1. ESTADO INICIAL
function iniciarEstado() {
    pantallaJuego.classList.add('oculto');
    pantallaSnake.classList.add('oculto');
    pantallaResultado.classList.add('oculto');
    pantallaInvitacion.classList.remove('oculto');

    const rectGo = btnGo.getBoundingClientRect();
    btnNo.style.top = `${rectGo.top}px`;
    btnNo.style.left = `${rectGo.right + 20}px`;
}

window.onload = iniciarEstado;
window.onresize = iniciarEstado;

// BOTÓN TRAVIESO
function escapar() {
    const padding = 50;
    const maxX = window.innerWidth - btnNo.offsetWidth - padding;
    const maxY = window.innerHeight - btnNo.offsetHeight - padding;

    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
}

btnNo.addEventListener('mouseover', escapar);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    escapar();
});

// PASAR DE INVITACIÓN A TRES EN RAYA
btnGo.addEventListener('click', () => {
    pantallaInvitacion.classList.add('oculto');
    btnNo.classList.add('oculto');

    pantallaJuego.removeAttribute('hidden');
    pantallaJuego.classList.remove('oculto');
});

// --- LÓGICA DEL TRES EN RAYA ---
const celdas = document.querySelectorAll('.celda');
const mensajeJuego = document.getElementById('mensaje-juego');
let tablero = ["", "", "", "", "", "", "", "", ""];
let juegoActivo = true;

const combinacionesGanadoras = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

celdas.forEach(celda => {
    celda.addEventListener('click', manejarClickCelda);
});

function manejarClickCelda(e) {
    const index = e.target.getAttribute('data-index');

    if (tablero[index] !== "" || !juegoActivo) return;

    hacerMovimiento(index, "X");

    if (verificarGanador("X")) {
        mensajeJuego.textContent = "te estas pasando :c";
        juegoActivo = false;

        // Pasa al juego de Snake
        setTimeout(() => {
            pantallaJuego.classList.add('oculto');
            pantallaSnake.classList.remove('oculto');
            iniciarSnake(); // Arranca el juego de la serpiente
        }, 1500);
        return;
    }

    if (tableroCompleto()) {
        reiniciarJuego("oño nadie gano we");
        return;
    }

    juegoActivo = false;
    mensajeJuego.textContent = "dame tiempo we";
    setTimeout(turnoMaquina, 1000);
}

function hacerMovimiento(index, jugador) {
    tablero[index] = jugador;
    celdas[index].textContent = jugador;
    celdas[index].style.color = jugador === "X" ? "#28a745" : "#dc3545";
}

function turnoMaquina() {
    let vacias = [];
    tablero.forEach((val, idx) => {
        if (val === "") vacias.push(idx);
    });

    if (vacias.length === 0) return;

    let movimientoElegido = null;

    for (let idx of vacias) {
        tablero[idx] = "O";
        if (verificarGanador("O")) {
            movimientoElegido = idx;
            tablero[idx] = "";
            break;
        }
        tablero[idx] = "";
    }

    if (movimientoElegido === null) {
        for (let idx of vacias) {
            tablero[idx] = "X";
            if (verificarGanador("X")) {
                movimientoElegido = idx;
                tablero[idx] = "";
                break;
            }
            tablero[idx] = "";
        }
    }

    if (movimientoElegido === null && tablero[4] === "") {
        movimientoElegido = 4;
    }

    if (movimientoElegido === null) {
        movimientoElegido = vacias[Math.floor(Math.random() * vacias.length)];
    }

    hacerMovimiento(movimientoElegido, "O");

    if (verificarGanador("O")) {
        reiniciarJuego("muejejejeje");
        return;
    }

    if (tableroCompleto()) {
        reiniciarJuego("oño, un empate tenemos que reiniciar we");
        return;
    }

    mensajeJuego.textContent = "Tu turno (X)";
    juegoActivo = true;
}

function verificarGanador(jugador) {
    return combinacionesGanadoras.some(combinacion => {
        return combinacion.every(index => tablero[index] === jugador);
    });
}

function tableroCompleto() {
    return tablero.every(celda => celda !== "");
}

function reiniciarJuego(mensaje) {
    mensajeJuego.textContent = mensaje;
    setTimeout(() => {
        tablero = ["", "", "", "", "", "", "", "", ""];
        celdas.forEach(celda => celda.textContent = "");
        mensajeJuego.textContent = "Tu turno (X)";
        juegoActivo = true;
    }, 2000);
}

// --- LÓGICA DEL JUEGO SNAKE (NOKIA) ---
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score-text");

const gridSize = 15;
const tileCount = canvas.width / gridSize;

let snake = [];
let food = { x: 0, y: 0 };
let dx = gridSize;
let dy = 0;
let score = 0;
let snakeInterval = null;

function iniciarSnake() {
    snake = [
        { x: 5 * gridSize, y: 10 * gridSize },
        { x: 4 * gridSize, y: 10 * gridSize },
        { x: 3 * gridSize, y: 10 * gridSize }
    ];
    dx = gridSize;
    dy = 0;
    score = 0;
    scoreText.textContent = `Puntos: ${score} / 10`;
    generarComida();

    if (snakeInterval) clearInterval(snakeInterval);
    snakeInterval = setInterval(bucleSnake, 130); // Velocidad serpiente
}

function generarComida() {
    food.x = Math.floor(Math.random() * tileCount) * gridSize;
    food.y = Math.floor(Math.random() * tileCount) * gridSize;
}

function bucleSnake() {
    moverSerpiente();

    if (comprobarColision()) {
        scoreText.textContent = "OÑO CHOCASTE WE";
        iniciarSnake();
        return;
    }

    dibujarSnake();
}

function moverSerpiente() {
    const cabeza = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(cabeza);

    // Si come la manzana
    if (cabeza.x === food.x && cabeza.y === food.y) {
        score++;
        scoreText.textContent = `Puntos: ${score} / 10`;

        // 🎯 LLEGAR A SCORE 10 -> GANAR Y PASAR AL YEI FINAL
        if (score >= 10) {
            clearInterval(snakeInterval);
            scoreText.textContent = "lo lograste we";
            setTimeout(() => {
                pantallaSnake.classList.add('oculto');
                pantallaResultado.classList.remove('oculto');
            }, 1200);
            return;
        }

        generarComida();
    } else {
        snake.pop(); // Si no come, remueve la cola
    }
}

function comprobarColision() {
    const cabeza = snake[0];

    // Choque con paredes
    if (cabeza.x < 0 || cabeza.x >= canvas.width || cabeza.y < 0 || cabeza.y >= canvas.height) {
        return true;
    }

    // Choque con su propio cuerpo
    for (let i = 1; i < snake.length; i++) {
        if (cabeza.x === snake[i].x && cabeza.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function dibujarSnake() {
    // Fondo retro Nokia (#9bbc0f)
    ctx.fillStyle = "#9bbc0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar manzana (#0f380f)
    ctx.fillStyle = "#0f380f";
    ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);

    // Dibujar serpiente (#0f380f)
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#0f380f" : "#306230";
        ctx.fillRect(part.x, part.y, gridSize - 2, gridSize - 2);
    });
}

// TECLAS DE FLECHA
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -gridSize; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = gridSize; }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -gridSize; dy = 0; }
    if (e.key === "ArrowRight" && dx === 0) { dx = gridSize; dy = 0; }
});

// BOTONES EN PANTALLA (Para celular)
document.getElementById("btnUp").addEventListener("click", () => { if (dy === 0) { dx = 0; dy = -gridSize; } });
document.getElementById("btnDown").addEventListener("click", () => { if (dy === 0) { dx = 0; dy = gridSize; } });
document.getElementById("btnLeft").addEventListener("click", () => { if (dx === 0) { dx = -gridSize; dy = 0; } });
document.getElementById("btnRight").addEventListener("click", () => { if (dx === 0) { dx = gridSize; dy = 0; } });

// --- CONTROL POR DESLIZAMIENTO (SWIPE) EN MÓVIL ---
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

canvas.addEventListener('touchend', (e) => {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    // Sensibilidad mínima para detectar el deslizamiento (20px)
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Movimiento Horizontal (Izquierda / Derecha)
        if (Math.abs(diffX) > 20) {
            if (diffX > 0 && dx === 0) {
                dx = gridSize; dy = 0; // Derecha
            } else if (diffX < 0 && dx === 0) {
                dx = -gridSize; dy = 0; // Izquierda
            }
        }
    } else {
        // Movimiento Vertical (Arriba / Abajo)
        if (Math.abs(diffY) > 20) {
            if (diffY > 0 && dy === 0) {
                dx = 0; dy = gridSize; // Abajo
            } else if (diffY < 0 && dy === 0) {
                dx = 0; dy = -gridSize; // Arriba
            }
        }
    }
}, { passive: true });