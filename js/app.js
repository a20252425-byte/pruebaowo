const btnNo = document.getElementById('btnNo');
const btnGo = document.getElementById('btnGo');
const cardInvitacion = document.getElementById('cardInvitacion');
const cardResultado = document.getElementById('cardResultado');

// Función para mover el botón "ño wakala" lejos del cursor
btnNo.addEventListener('mouseover', () => {
    // Calculamos posiciones aleatorias dentro del recuadro
    const x = Math.random() * (cardInvitacion.clientWidth - btnNo.clientWidth);
    const y = Math.random() * (cardInvitacion.clientHeight - btnNo.clientHeight);

    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
});

// Cuando haga clic en "Go pe"
btnGo.addEventListener('click', () => {
    cardInvitacion.classList.add('hidden');
    cardResultado.classList.remove('hidden');
});