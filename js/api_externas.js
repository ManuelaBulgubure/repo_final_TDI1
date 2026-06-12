// SELECCIONAR ELEMENTOS DEL DOM
const formulario = document.getElementById("form-dolar");
const inputFecha = document.getElementById("fecha-dolar");
const resultado = document.getElementById("contenedor-cotizaciones");
const formClima = document.getElementById("form-clima");
const inputCiudadClima = document.getElementById("ciudad-clima");
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

function mostrarClima(datos, ciudadAConsultar) {
    const temperatura = datos.current_condition[0].temp_C;
    const estadoClima = datos.current_condition[0].lang_es ? datos.current_condition[0].lang_es[0].value : "Despejado";
    const pais = datos.nearest_area?.[0]?.country?.[0]?.value || "Argentina";
    const area = datos.nearest_area?.[0]?.areaName?.[0]?.value || ciudadAConsultar;

    const contenedorClima = document.getElementById('clima-container');
    if (contenedorClima) {
        contenedorClima.innerHTML = `
            <h2>Clima de ${area}, ${pais}</h2>
            <p> <strong>Temperatura actual:</strong>
            <br>
            ${temperatura}°C </p>
            <p> <strong>Condición:</strong>
            <br>
            ${estadoClima}</p>
            <p class="fecha-consulta"> Consulta: ${new Date().toLocaleString('es-AR')}</p>
        `;
    }
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

// Función avanzada para obtener el clima actual de cualquier ciudad con HTML semántico
async function obtenerClima(ciudad = 'Rosario') {
    const ciudadAConsultar = ciudad.trim() || 'Rosario';

    try {
        const respuesta = await fetch(`https://wttr.in/${encodeURIComponent(ciudadAConsultar)}?format=j1`);
        
        if (!respuesta.ok) {
            throw new Error('Error en la conexión con la API');
        }

        const datos = await respuesta.json();
        
        if (!datos || !datos.current_condition?.length) {
            throw new Error('No se obtuvo información de clima para esa ciudad');
        }

        mostrarClima(datos, ciudadAConsultar);
    } catch (error) {
        console.error('Error al traer el clima:', error);
        const contenedorClima = document.getElementById('clima-container');
        if (contenedorClima) {
            contenedorClima.innerHTML = `
                <h2>Clima no disponible</h2>
                <p><strong>Ciudad:</strong><br>${ciudadAConsultar}</p>
                <p>No se encontró la ciudad. Verificá la ortografía o probá otra ciudad.</p>
                <p class="fecha-consulta">Consulta: ${new Date().toLocaleString('es-AR')}</p>
            `;
        }
    }
}

if (formClima) {
    formClima.addEventListener('submit', function(event) {
        event.preventDefault();
        const ciudadSeleccionada = inputCiudadClima.value.trim() || 'Rosario';
        obtenerClima(ciudadSeleccionada);
    });
}

document.addEventListener('DOMContentLoaded', () => obtenerClima(inputCiudadClima?.value || 'Rosario'));