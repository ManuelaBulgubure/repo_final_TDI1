// ids centralizadas para evitar repeticion
const BOTON_ID = 'btn-cambiar-color';

const CLASE_MODO_OSCURO = 'modo-oscuro';

const STORAGE_KEY = 'colorPagina';

// funcion para actualizar el boton segun tema activo (oscuro / claro)
function actualizarTextoBoton(esModoOscuro) {
    const boton = document.getElementById(BOTON_ID);
    if (!boton) return;
    boton.textContent = esModoOscuro ? 'Modo Claro' : 'Modo Oscuro';
}

// aplica (o remueve) clase global que controla tema desde css
function aplicarModoOscuro(esModoOscuro) {
    document.body.classList.toggle(CLASE_MODO_OSCURO, esModoOscuro);
    actualizarTextoBoton(esModoOscuro);
}

// lee la preferencia desde localstorage que carga la funcion siguiente
function leerPreferenciaTema() {
    return localStorage.getItem(STORAGE_KEY) === 'oscuro';
}

// guarda preferencia en localstorage
function guardarPreferenciaTema(esModoOscuro) {
    localStorage.setItem(STORAGE_KEY, esModoOscuro ? 'oscuro' : 'claro');
}

// boton de cambio de tema y configurar eventos
function crearBotonCambiarColor() {
    const botonColor = document.createElement('button');
    botonColor.id = BOTON_ID;
    botonColor.type = 'button';
    botonColor.classList.add('tema-boton');

    const menu = document.querySelector('.menu');   // inserta boton al menu princ
    if (menu) {
        menu.appendChild(botonColor);
    }

    const modoOscuroInicial = leerPreferenciaTema(); // la funcion para la pref del tema
    aplicarModoOscuro(modoOscuroInicial);
    guardarPreferenciaTema(modoOscuroInicial);

    // alternar tema al clickear y guardar nuevo
    botonColor.addEventListener('click', () => {
        const estaOscuro = document.body.classList.toggle(CLASE_MODO_OSCURO);
        actualizarTextoBoton(estaOscuro);
        guardarPreferenciaTema(estaOscuro);
    });
}

// carga
window.addEventListener('load', crearBotonCambiarColor);