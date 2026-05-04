// boton modo oscuro / claro
function crearBotonCambiarColor() {
    // Crear el boton
    const botonColor = document.createElement('button');
    botonColor.id = 'btn-cambiar-color';
    botonColor.textContent = 'Modo Oscuro';
    
    // Estilos basicos del boton
    botonColor.style.position = 'fixed';
    botonColor.style.top = '10px';
    botonColor.style.right = '10px';
    botonColor.style.padding = '10px 20px';
    botonColor.style.zIndex = '1000';
    botonColor.style.cursor = 'pointer';
    
    // Agregar al body
    document.body.appendChild(botonColor);
    
    let esModoOscuro = false;
    
    // Evento click para cambiar color
    botonColor.addEventListener('click', function() {
        esModoOscuro = !esModoOscuro;
        
        if (esModoOscuro) {
            // Modo oscuro
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#ffffff';
            botonColor.textContent = 'Modo Claro';
        } else {
            // Modo claro
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#000000';
            botonColor.textContent = 'Modo Oscuro';
        }
        
        // Guardar preferencia en localStorage
        localStorage.setItem('colorPagina', esModoOscuro ? 'oscuro' : 'claro');
    });
    
    // Recuperar color guardado
    const colorGuardado = localStorage.getItem('colorPagina');
    if (colorGuardado === 'oscuro') {
        esModoOscuro = true;
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#ffffff';
        botonColor.textContent = 'Modo Claro';
    }
}
window.addEventListener('load', function() {
    crearBotonCambiarColor();
});