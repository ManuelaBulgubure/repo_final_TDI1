// noticias hardcodeadas modificar posteriormente
const noticias = [
    {
        titulo: "Titulo 1",
        descripcion: "Desc 1",
        imagen: "http://modificar.url"
    },
    {
        titulo: "Titulo 2",
        descripcion: "Desc 2",
        imagen: "http://modificar.url"
    },
    {
        titulo: "Titulo 3",
        descripcion: "Desc 3",
        imagen: "http://modificar.url"
    }
];

// noticias en el dom
function mostrarNoticias() {
    const contenedor = document.getElementById('contenedor-noticias');

    for (let i = 0; i < noticias.length; i++) {
        
        // Contenedor de cada noticia
        const card = document.createElement('div');
        card.style.border = "1px solid black";
        card.style.margin = "10px";
        card.style.padding = "10px";
        card.style.width = "300px";
        card.style.display = "inline-block";
        card.style.verticalAlign = "top";

        // Imagen
        const img = document.createElement('img');
        img.src = noticias[i].imagen;
        img.style.width = "100%";

        // Título
        const titulo = document.createElement('h2');
        titulo.textContent = noticias[i].titulo;

        // Descripción
        const desc = document.createElement('p');
        desc.textContent = noticias[i].descripcion;

        // Agregar todo al card
        card.appendChild(img);
        card.appendChild(titulo);
        card.appendChild(desc);

        // Agregar card al contenedor
        contenedor.appendChild(card);
    }
}

// Ejecutar al cargar
window.addEventListener('load', function() {
    mostrarNoticias();
});