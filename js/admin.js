const formularioLogin = document.getElementById("formulario-login");
const usuario = document.getElementById("usuario");
const clave = document.getElementById("clave");
const mensajeError = document.getElementById("mensaje-error");

const login = document.getElementById("login");
const panel = document.getElementById("panel");

const nuevoTitulo = document.getElementById("nuevo-titulo");
const nuevoTexto = document.getElementById("nuevo-texto");
const guardar = document.getElementById("guardar");

const tituloNoticia = document.getElementById("titulo-noticia");
const textoNoticia = document.getElementById("texto-noticia");

const salir = document.getElementById("salir");

formularioLogin.addEventListener("submit", function(evento) {
  evento.preventDefault();

  if (usuario.value === "admin" && clave.value === "1234") {
    login.classList.add("oculto");
    panel.classList.remove("oculto");
    mensajeError.textContent = "";
  } else {
    mensajeError.textContent = "Usuario o contraseña incorrectos.";
  }
});

guardar.addEventListener("click", function() {
  if (nuevoTitulo.value === "" || nuevoTexto.value === "") {
    alert("Completá todos los campos.");
  } else {
    tituloNoticia.textContent = nuevoTitulo.value;
    textoNoticia.textContent = nuevoTexto.value;

    alert("La noticia fue modificada correctamente.");
  }
});

salir.addEventListener("click", function() {
  panel.classList.add("oculto");
  login.classList.remove("oculto");

  usuario.value = "";
  clave.value = "";
  nuevoTitulo.value = "";
  nuevoTexto.value = "";
});