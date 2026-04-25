const uri = "https://api.openweathermap.org/data/2.5/forecast";
const apiKey = "b462a640f2d70dcfd26f70ac99730f0c";

// Variables de estado
let currentUnit = 'metric';
let currentCity = 'Zarate';
let currentDays = 8;

// Hacer fetch de la API
async function hacerFetch(ciudad, dias) {
    currentCity = ciudad;
    currentDays = dias;
    const url = `${uri}?appid=${apiKey}&lang=es&units=${currentUnit}&cnt=${dias}&q=${ciudad}`;
    
    // Mostrar el estado de carga antes de pedir los datos
    mostrarSkeleton();

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ciudad no encontrada o error en la red');
        }
        const data = await response.json();
        mostrarClima(data);
    } catch (error) {
        mostrarError();
        console.error('Error al obtener datos:', error);
    }
}
// Cargar Ciudad Zarate al Inicio
document.addEventListener('DOMContentLoaded', async () => {
    const unitToggle = document.getElementById('unit-toggle');
    if (unitToggle) {
        unitToggle.addEventListener('click', (e) => {
            currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
            e.target.innerText = currentUnit === 'metric' ? '°C' : '°F';
            hacerFetch(currentCity, currentDays);
        });
    }

    const geoBtn = document.getElementById('geo-btn');
    if (geoBtn) {
        geoBtn.addEventListener('click', obtenerUbicacion);
    }

    await hacerFetch("Zarate", 8);
});

//  Evento de submit ciudad y dias.
document.addEventListener('submit', async (event) => {
    event.preventDefault();
    formularioValores()
});

function formularioValores() {
    let city = document.getElementById("city").value.trim();
    if (!city) {
        city = currentCity; // Si el input está vacío, buscamos la última ciudad registrada
    }
    
    let diasInput = parseInt(document.getElementById("dias").value) || 1;
    if (diasInput > 5) diasInput = 5; // La API gratuita limita a 5 días máximo
    if (diasInput < 1) diasInput = 1;
    
    hacerFetch(city, diasInput * 8);
}

// Función para obtener clima por coordenadas
async function hacerFetchPorCoordenadas(lat, lon, dias) {
    currentDays = dias;
    // Se utilizan los parametros lat y lon en lugar de q
    const url = `${uri}?appid=${apiKey}&lang=es&units=${currentUnit}&cnt=${dias}&lat=${lat}&lon=${lon}`;
    
    mostrarSkeleton();

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ubicación no encontrada o error en la red');
        }
        const data = await response.json();
        
        // ¡Truco importante! Actualizamos currentCity con el nombre real de la zona
        // devuelto por la API. Así el toggle de unidades seguirá funcionando.
        currentCity = data.city.name; 
        mostrarClima(data);
    } catch (error) {
        mostrarError();
        console.error('Error al obtener datos por ubicación:', error);
    }
}

// Función para iniciar la geolocalización usando el navegador
function obtenerUbicacion() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let diasInput = parseInt(document.getElementById("dias").value) || 1;
                if (diasInput > 5) diasInput = 5;
                if (diasInput < 1) diasInput = 1;
                
                hacerFetchPorCoordenadas(position.coords.latitude, position.coords.longitude, diasInput * 8);
            },
            (error) => {
                console.error("Error obteniendo ubicación:", error);
                alert("No pudimos acceder a tu ubicación. Verifica los permisos de tu navegador.");
            }
        );
    } else {
        alert("Tu navegador no soporta la geolocalización.");
    }
}

// Funciones profesionales para parsear datos a tiempo real usando Intl
function horasMinutos(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('es-ES', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
}

function parseTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getDayAndHour(dt_txt) {
    const date = new Date(dt_txt);
    return date.toLocaleString('es-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) + 'hs';
}

// Mostrar el clima
function mostrarClima(data) {
    const DIV = document.getElementById("clima");
    DIV.innerHTML = ''; // Limpiar el contenido anterior.
    const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';

    // Elemento padre
    const container = document.createElement("div");
    container.classList.add("CardCiudad");

    // Titulo de Ciudad
    const titulo = document.createElement('h1');
    titulo.innerText = `${data.city.name}, ${data.city.country}`;
    container.appendChild(titulo);

    // Población
    const poblacion = document.createElement('p');
    poblacion.innerHTML = `<img src="https://img.icons8.com/?size=100&id=T2S7nLjBUR4l&format=png&color=000000" alt="Población" title="Población"> ${data.city.population.toLocaleString('es-ES')} aprox.`;
    container.appendChild(poblacion);

    // Salida del Sol
    const salidaSol = document.createElement('p');
    salidaSol.innerHTML = `<img src="https://img.icons8.com/?size=100&id=9314&format=png&color=000000" alt="Salida de Sol" title="Salida de Sol">${horasMinutos(data.city.sunrise, data.city.timezone)}`;
    container.appendChild(salidaSol);

    // Puesta del Sol
    const puestaSol = document.createElement('p');
    puestaSol.innerHTML = `<img src="https://img.icons8.com/?size=100&id=9253&format=png&color=000000" alt="Puesta de Sol" title="Puesta de Sol">${horasMinutos(data.city.sunset, data.city.timezone)}`;
    container.appendChild(puestaSol);
    DIV.appendChild(container);

    const divCards = document.createElement("div");
    divCards.classList.add("divCards");

    // Foreach de LIST(datos relevantes)
    data.list.forEach(element => {
        const div = document.createElement('div');
        div.classList.add("CardWeather");
        div.innerHTML = `
            <h2 class="weather-date">${getDayAndHour(element.dt_txt)}</h2>
            
            <div class="weather-main">
                <img class="weather-icon" src="https://openweathermap.org/img/wn/${element.weather[0].icon}@4x.png" alt="${element.weather[0].description}" title="${element.weather[0].description}">
                <div class="weather-temp" title="Temperatura">${Math.round(element.main.temp)}${unitSymbol}</div>
                <div class="weather-minmax" title="Máx / Mín">
                    <span class="temp-max">${Math.round(element.main.temp_max)}${unitSymbol}</span> / <span class="temp-min">${Math.round(element.main.temp_min)}${unitSymbol}</span>
                </div>
            </div>

            <div class="weather-details">
                <div class="detail-item" title="Sensación Térmica"><img src="https://img.icons8.com/?size=100&id=HmOAh0U72WAF&format=png&color=000000" alt="ST"> ${Math.round(element.main.feels_like)}${unitSymbol}</div>
                <div class="detail-item" title="Humedad"><img src="https://img.icons8.com/?size=100&id=A01OMLqyaokr&format=png&color=000000" alt="Humedad"> ${element.main.humidity}%</div>
                <div class="detail-item" title="Velocidad del viento"><img src="https://img.icons8.com/?size=100&id=RtDA8YDN9Mi9&format=png&color=000000" alt="Viento"> ${Math.round(element.wind.speed)} km/h</div>
                <div class="detail-item" title="Nubes"><img src="https://img.icons8.com/?size=100&id=mD5PxYIC4jJB&format=png&color=000000" alt="Nubes"> ${element.clouds.all}%</div>
                <div class="detail-item" title="Presión"><img src="https://img.icons8.com/?size=100&id=HJ1sbJDgQ6i5&format=png&color=000000" alt="Presión"> ${element.main.pressure} hPa</div>
                <div class="detail-item" title="Visibilidad"><img src="https://img.icons8.com/?size=100&id=38869&format=png&color=000000" alt="Visibilidad"> ${(element.visibility / 1000).toFixed(1)} km</div>
            </div>
            
            <div class="weather-footer" title="Fecha">${parseTimestamp(element.dt)}</div>
        `;
        divCards.appendChild(div);
    });
    DIV.appendChild(divCards);
}

// Función para manejar errores de búsqueda
function mostrarError() {
    const DIV = document.getElementById("clima");
    DIV.innerHTML = `
        <div class="error-container">
            <img src="https://img.icons8.com/?size=100&id=12226&format=png&color=000000" alt="Error" width="64">
            <h2>¡Ups! Ciudad no encontrada</h2>
            <p>Por favor, verifica el nombre e intenta nuevamente.</p>
        </div>
    `;
}

// Función para mostrar el esqueleto de carga (Loading State)
function mostrarSkeleton() {
    const DIV = document.getElementById("clima");
    
    // Creamos la cabecera (Ciudad)
    let skeletonHTML = `
        <div class="CardCiudad skeleton-card">
            <div class="skeleton" style="width: 50%; height: 32px; margin-bottom: 10px;"></div>
            <div style="display: flex; gap: 30px; justify-content: center; width: 100%; flex-wrap: wrap;">
                <div class="skeleton" style="width: 140px; height: 24px;"></div>
                <div class="skeleton" style="width: 140px; height: 24px;"></div>
                <div class="skeleton" style="width: 140px; height: 24px;"></div>
            </div>
        </div>
        <div class="divCards">
    `;

    // Generamos 8 tarjetas de pronóstico falsas
    for (let i = 0; i < 8; i++) {
        skeletonHTML += `
            <div class="CardWeather skeleton-card">
                <div class="skeleton" style="width: 60%; height: 24px; margin-bottom: 20px;"></div>
                <div class="skeleton skeleton-circle" style="width: 90px; height: 90px; margin-bottom: 10px;"></div>
                <div class="skeleton" style="width: 40%; height: 48px; margin-bottom: 10px;"></div>
                <div class="skeleton" style="width: 50%; height: 20px; margin-bottom: 20px;"></div>
                <div class="skeleton" style="width: 100%; height: 80px; margin-top: 15px;"></div>
            </div>
        `;
    }

    skeletonHTML += `</div>`;
    
    DIV.innerHTML = skeletonHTML;
}
