const uri = "https://api.openweathermap.org/data/2.5/forecast";
const apiKey = "b462a640f2d70dcfd26f70ac99730f0c";

// Hacer fetch de la API
async function hacerFetch(ciudad, dias) {
    const url = `${uri}?appid=${apiKey}&lang=ES&units=metric&cnt=${dias}&q=${ciudad}`;
    console.log(url)
    try {
        const response = await fetch(url);
        const data = await response.json();
        mostrarClima(data);
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await hacerFetch("Zarate", 7);
});

document.addEventListener('submit', async (event) => {
    event.preventDefault();
    formularioValores()
});

function formularioValores() {
    const city = document.getElementById("city").value;
    const dias = document.getElementById("dias").value || 7;
    hacerFetch(city, dias);
};


// Funciones para parsear datos a tiempo real
function horasMinutos(timestamp, timezone) {
    const date = new Date((parseInt(timestamp) + parseInt(timezone)) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function parseTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}

function getDayOfWeek(timestamp) {
    const date = new Date(timestamp * 1000);
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayOfWeek = date.getUTCDay();
    return daysOfWeek[dayOfWeek];
}

// Mostrar el clima
function mostrarClima(data) {
    const container = document.getElementById('clima');
    container.innerHTML = ''; // Limpiar el contenido anterior

    // Titulo de Ciudad
    const titulo = document.createElement('h2');
    titulo.innerText = `${data.city.name}, ${data.city.country}`;
    container.appendChild(titulo);

    // Población
    const poblacion = document.createElement('p');
    poblacion.innerText = `Población: ${data.city.population}`;
    container.appendChild(poblacion);

    // Salida del Sol
    const salidaSol = document.createElement('p');
    salidaSol.innerText = `Salida del Sol: ${horasMinutos(data.city.sunrise, data.timezone)}`;
    container.appendChild(salidaSol);

    // Puesta del Sol
    const puestaSol = document.createElement('p');
    puestaSol.innerText = `Puesta del Sol: ${horasMinutos(data.city.sunset, data.timezone)}`;
    container.appendChild(puestaSol);

    data.list.forEach(element => {
        const div = document.createElement('div');
        div.innerHTML = `
        <h1>Clima del Día: ${getDayOfWeek(element.dt)}</h1>

        <div class="clima-container">
            <ul>
                <li><strong>Fecha:</strong> ${parseTimestamp(element.dt)}</li>
                <li><strong>Temperatura:</strong> ${element.main.temp}°C</li>
                <li><strong>Sensación Térmica:</strong> ${element.main.feels_like}°C</li>
                <li><strong>Máximo:</strong> ${element.main.temp_max}°C</li>
                <li><strong>Mínimo:</strong> ${element.main.temp_min}°C</li>
                <li><strong>Presión:</strong> ${element.main.pressure} hPa</li>
                <li><strong>Humedad:</strong> ${element.main.humidity}%</li>
                <li><strong>Clima:</strong> ${element.weather[0].description}</li>
                <li><strong>Nubes:</strong> ${element.clouds.all}%</li>
                <li><strong>Velocidad del Viento:</strong> ${element.wind.speed} km/h</li>
                <li><strong>Visibilidad:</strong> ${(element.visibility / 1000).toFixed(1)} km</li>
            </ul>
        </div>`;
        container.appendChild(div);
    });
}
