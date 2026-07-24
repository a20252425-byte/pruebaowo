const btnNo = document.getElementById('btnNo');
const btnGo = document.getElementById('btnGo');
const pantallaInvitacion = document.getElementById('invitacion');
const pantallaJuego = document.getElementById('pantalla-juego');
const pantallaResultado = document.getElementById('resultado');

// Acomodar botón "ño wakala"
function acomodarBotonInicial() {
    const rectGo = btnGo.getBoundingClientRect();
    btnNo.style.top = `${rectGo.top}px`;
    btnNo.style.left = `${rectGo.right + 20}px`;
}

window.onload = acomodarBotonInicial;
window.onresize = acomodarBotonInicial;

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

// PASAR DE LA INVITACIÓN AL MINIJUEGO
btnGo.addEventListener('click', () => {
    pantallaInvitacion.classList.add('oculto');
    btnNo.classList.add('oculto');

    pantallaJuego.removeAttribute('hidden');
    pantallaJuego.classList.remove('oculto');
});

// LÓGICA DEL TRES EN RAYA
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

    // Jugador (X)
    hacerMovimiento(index, "X");

    if (verificarGanador("X")) {
        mensajeJuego.textContent = "te estas pasando :c";
        juegoActivo = false;

        // Esperamos 1 segundo para que vea la victoria y LUEGO cambiamos
        setTimeout(() => {
            // 1. OCULTAR EL MINIJUEGO COMPLETAMENTE
            pantallaJuego.classList.add('oculto');
            pantallaJuego.setAttribute('hidden', 'true');

            // 2. MOSTRAR LA PANTALLA FINAL
            pantallaResultado.removeAttribute('hidden');
            pantallaResultado.classList.remove('oculto');
        }, 1200);
        return;
    }

    if (tableroCompleto()) {
        reiniciarJuego("oño nadie gano we");
        return;
    }

    // Turno de la Máquina (O)
    juegoActivo = false;
    mensajeJuego.textContent = "dame tiempo we";
    setTimeout(turnoMaquina, 500);
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

    if (vacias.length > 0) {
        const randomIndex = vacias[Math.floor(Math.random() * vacias.length)];
        hacerMovimiento(randomIndex, "O");

        if (verificarGanador("O")) {
            reiniciarJuego("muejejejeje");
            return;
        }

        if (tableroCompleto()) {
            reiniciarJuego("oño, un empate tenemos que reiniciar we");
            return;
        }
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
    }, 1500);
}