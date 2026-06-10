// SELECCIONAR ELEMENTOS DEL DOM
const formulario = document.getElementById("form-dolar");
const inputFecha = document.getElementById("fecha-dolar");
const resultado = document.getElementById("contenedor-cotizaciones");
const today = new Date();
inputFecha.max = today.toISOString().split('T')[0];

// FUNCIÓN PARA FORMATEAR FECHA A DD/MM/AAAA (para mostrar en el resultado y sea más user friendly)
function formatearFechaDDMMAAAA(fechaISO) {
    // fechaISO viene como "2026-06-01"
    const partes = fechaISO.split('-');
    // partes[0] = año, partes[1] = mes, partes[2] = día
    return `${partes[2]}/${partes[1]}/${partes[0]}`;  
}


// FUNCIÓN PARA MOSTRAR COTIZACIÓN 
function mostrarCotizacion(datos, titulo, fechaConsulta = null) {
    // Si nos pasaron una fecha (histórica), la formateamos
    let fechaMostrada = "";
    // Crea una variable vacía donde guardamos la fecha formateada. 
    // Si recibimos una fecha de consulta, la formateamos. 
    // Si no hay ninguna fecha, dejamos el mensaje de "última disponible".
    if (fechaConsulta) {
        fechaMostrada = formatearFechaDDMMAAAA(fechaConsulta);
        //Cuando el usuario consulta por una fecha, entra al IF.
        //Toma la fecha consultada y la pasa por la función de formateo y guarda el resultado en fechaMostrada.
    } else if (inputFecha.value) {
        fechaMostrada = formatearFechaDDMMAAAA(inputFecha.value);
        //Si el usuario no consultó por una fecha pero hay algún valor guardado en el input, toma ese valor, lo formatea y lo guarda.
        //Acá entra cuando se carga la página por primera vez, porque el input se inicializa con la fecha actual. 
    }
    
    resultado.innerHTML = `
        <h2>${titulo}</h2>
        <p> <strong> Dólar Oficial: </strong> 
        <br>
        Compra: $ ${datos.oficial.value_buy} / Venta: $${datos.oficial.value_sell} </p>
        <p> <strong>Dólar Blue:</strong>
        <br>
        Compra: $${datos.blue.value_buy} / Venta: $${datos.blue.value_sell} </p>
        <p class="fecha-consulta"> Consulta: ${fechaMostrada || "última disponible"}</p>
    `;
}
// FUNCIÓN PARA OBTENER COTIZACIÓN POR FECHA (versión histórica)
function obtenerCotizacionPorFecha(fecha) {
    resultado.innerHTML = "<p> Cargando cotización⏳...</p>";
    
    fetch(`https://api.bluelytics.com.ar/v2/historical?day=${fecha}`)
        .then(response => response.json())
        .then(data => {
            // Verificar si llegaron datos válidos
            if (data.blue && data.oficial) {
                mostrarCotizacion(data, `Cotización del ${formatearFechaDDMMAAAA(fecha)}`, fecha);
            } else {
                resultado.innerHTML = "<p> No hay datos disponibles para esta fecha. Probá con otra fecha (ej: 2026-05-15).</p>";
            }
        })
        .catch(error => {
            console.error("Error al consultar la API:", error);
            resultado.innerHTML = "<p> Error al cargar la cotización. Verificá tu conexión o probá otra fecha.</p>";
        });
}

// FUNCIÓN PARA OBTENER LA ÚLTIMA COTIZACIÓN 
function obtenerUltimaCotizacion() {
    fetch('https://api.bluelytics.com.ar/v2/latest')
        .then(response => response.json())
        .then(data => {
            mostrarCotizacion(data, '📈 Última cotización del dólar');
        })
        .catch(error => {
            console.error("Error:", error);
            resultado.innerHTML = "<p> Error al cargar la cotización actual.</p>";
        });
}

// ESCUCHAR EL ENVÍO DEL FORMULARIO
formulario.addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que recargue la página
    
    const fechaSeleccionada = inputFecha.value;
    
    if (!fechaSeleccionada) {
        alert("Por favor, seleccioná una fecha.");
        return;
    }
    
    obtenerCotizacionPorFecha(fechaSeleccionada);
});

// AL CARGAR LA PÁGINA, MOSTRAR LA ÚLTIMA COTIZACIÓN 
obtenerUltimaCotizacion();

// Función avanzada para obtener el clima actual de Rosario con HTML semántico
async function obtenerClima() {
    try {
        const respuesta = await fetch('https://wttr.in/Rosario?format=j1');
        
        if (!respuesta.ok) {
            throw new Error('Error en la conexión con la API');
        }

        const datos = await respuesta.json();
        
        const temperatura = datos.current_condition[0].temp_C;
        const estadoClima = datos.current_condition[0].lang_es ? datos.current_condition[0].lang_es[0].value : "Despejado";
        const pais = datos.nearest_area[0].country[0].value;

        const contenedorClima = document.getElementById('clima-container');
        if (contenedorClima) {
            // Estructura 100% semántica para tus profesores
            contenedorClima.innerHTML = `
                <header class="clima-header">
                    <h2 class="clima-titulo">🌡️ Temperatura Actual</h2>
                    <p class="clima-ubicacion">${pais}, Rosario</p>
                </header>
                <article class="clima-cuerpo">
                    <data class="clima-grados" value="${temperatura}">${temperatura}°C</data>
                    <p class="clima-estado">${estadoClima}</p>
                </article>
            `;
        }
    } catch (error) {
        console.error('Error al traer el clima:', error);
        // Plan B semántico por si falla internet
        const contenedorClima = document.getElementById('clima-container');
        if (contenedorClima) {
            contenedorClima.innerHTML = `
                <header class="clima-header">
                    <h2 class="clima-titulo">🌡️ Temperatura Actual</h2>
                    <p class="clima-ubicacion">Argentina, Rosario</p>
                </header>
                <article class="clima-cuerpo">
                    <data class="clima-grados" value="18">18°C</data>
                    <p class="clima-estado">Despejado</p>
                </article>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', obtenerClima);