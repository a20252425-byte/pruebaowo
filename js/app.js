const btnNo = document.getElementById('btnNo');
const btnGo = document.getElementById('btnGo');
const pantallaInvitacion = document.getElementById('invitacion');
const pantallaResultado = document.getElementById('resultado');

// Posicionar el botón 'ño wakala' al inicio justo al lado de 'Go pe'
function acomodarBotonInicial() {
    const rectGo = btnGo.getBoundingClientRect();
    btnNo.style.top = `${rectGo.top}px`;
    btnNo.style.left = `${rectGo.right + 20}px`;
}

// Ejecutar posicionamiento inicial
window.onload = acomodarBotonInicial;
window.onresize = acomodarBotonInicial;

// Función para escapar por TODA la pantalla
function escapar() {
    const padding = 50;
    const maxX = window.innerWidth - btnNo.offsetWidth - padding;
    const maxY = window.innerHeight - btnNo.offsetHeight - padding;

    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
}

// Eventos para mover el botón
btnNo.addEventListener('mouseover', escapar);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    escapar();
});

// Evento botón verde
btnGo.addEventListener('click', () => {
    pantallaInvitacion.style.display = 'none';
    btnNo.style.display = 'none';
    pantallaResultado.classList.add('show');
});