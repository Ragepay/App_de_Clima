const uri = "https://api.openweathermap.org/data/2.5/forecast";
const apiKey = "b462a640f2d70dcfd26f70ac99730f0c";

// Hacer fetch de la API
async function hacerFetch(ciudad, dias) {
    const url = `${uri}?appid=${apiKey}&lang=ES&units=metric&cnt=${dias}&q=${ciudad}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        mostrarClima(data);
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}
// Cargar Ciudad Zarate al Inicio
document.addEventListener('DOMContentLoaded', async () => {
    await hacerFetch("Zarate", 8);
});

//  Evento de submit ciudad y dias.
document.addEventListener('submit', async (event) => {
    event.preventDefault();
    formularioValores()
});

function formularioValores() {
    const city = document.getElementById("city").value;
    const dias = (document.getElementById("dias").value) * 8 || 8;
    hacerFetch(city, dias);
};


// Funciones para parsear datos a tiempo real
function horasMinutos(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
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

function getDayAndHour(dt_txt) {
    const date = new Date(dt_txt);
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const dayOfWeek = daysOfWeek[date.getDay()]; // Obtener día de la semana abreviado
    const hours = date.getHours(); // Obtener horas
    return `${dayOfWeek} ${hours.toString().padStart(2, '0')}hs`;
}

// Mostrar el clima
function mostrarClima(data) {
    const DIV = document.getElementById("clima");
    DIV.innerHTML = ''; // Limpiar el contenido anterior.

    //  Eleemneto padre
    const container = document.createElement("div");
    container.classList.add("CardCiudad")

    // Titulo de Ciudad
    const titulo = document.createElement('h1');
    titulo.innerText = `${data.city.name}, ${data.city.country}`;
    container.appendChild(titulo);

    // Población
    const poblacion = document.createElement('p');
    poblacion.innerHTML = `<img src="https://img.icons8.com/?size=100&id=T2S7nLjBUR4l&format=png&color=000000" alt="Población" title="Población"></img> ${data.city.population} aprox.`;
    container.appendChild(poblacion);

    // Salida del Sol
    const salidaSol = document.createElement('p');
    salidaSol.innerHTML = `<img src="https://img.icons8.com/?size=100&id=9314&format=png&color=000000" alt="Salida de Sol" title="Salida de Sol"></img>${horasMinutos(data.city.sunrise, data.city.timezone)}`;
    container.appendChild(salidaSol);

    // Puesta del Sol
    const puestaSol = document.createElement('p');
    puestaSol.innerHTML = `<img src="https://img.icons8.com/?size=100&id=9253&format=png&color=000000" alt="Puesta de Sol" title="Puesta de Sol"></img>${horasMinutos(data.city.sunset, data.city.timezone)}`;
    container.appendChild(puestaSol);
    DIV.appendChild(container);

    const divCards = document.createElement("div");
    divCards.classList.add("divCards");

    //  Foreach de LIST(datos relevantes)
    data.list.forEach(element => {
        const div = document.createElement('div');
        div.classList.add("CardWeather")
        div.innerHTML = `
        <h2>${getDayAndHour(element.dt_txt)}</h2>

        <div class="clima-container">
            <div class="div1"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="${element.weather[0].description}" title="${element.weather[0].description}"></img></div>
            <div class="div2" title="Temperatura">${element.main.temp}°C</div>
            <div class="div3" title="Temperatura Maxima"><span>${element.main.temp_max}°C</span> / <span>${element.main.temp_min}°C</span></div>
            
            <div class="div5"><img src="https://img.icons8.com/?size=100&id=mD5PxYIC4jJB&format=png&color=000000" alt="Nubes" title="Nubes"></img> ${element.clouds.all}%</div>
            <div class="div6"><img src="https://img.icons8.com/?size=100&id=HmOAh0U72WAF&format=png&color=000000" alt="Sensación Térmica" title="Sensación Térmica"></img> ${element.main.feels_like}°C</div>
            <div class="div7"><img src="https://img.icons8.com/?size=100&id=A01OMLqyaokr&format=png&color=000000" alt="Humedad" title="Humedad"></img> ${element.main.humidity}%</div>
            <div class="div8"><img src="https://img.icons8.com/?size=100&id=38869&format=png&color=000000" alt="Visibilidad" title="Visibilidad"></img> ${(element.visibility / 1000).toFixed(1)} km</div>
            <div class="div9"><img src="https://img.icons8.com/?size=100&id=HJ1sbJDgQ6i5&format=png&color=000000" alt="Presión" title="Presión"></img> ${element.main.pressure} hPa</div>
            <div class="div10"><img src="https://img.icons8.com/?size=100&id=RtDA8YDN9Mi9&format=png&color=000000" alt="Velocidad del viento" title="Velocidad del viento"></img> ${element.wind.speed} km/h</div>
            <div class="div11" title="Fecha">${parseTimestamp(element.dt)}</div>
        </div>`;
        divCards.appendChild(div);
    });
    DIV.appendChild(divCards);
}
