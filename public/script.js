const weatherContainer = document.getElementById("weather-container");

//  Background
function updateBackground(weather) {
    const w = weather.toLowerCase();
    let bg = "";

    if (w.includes("cloud")) bg = "/gifs/clouds.gif";
    else if (w.includes("rain") || w.includes("drizzle")) bg = "/gifs/rain.gif";
    else if (w.includes("clear") || w.includes("sun")) bg = "/gifs/clear.gif";
    else if (w.includes("snow")) bg = "/gifs/snow.gif";
    else if (w.includes("thunder")) bg = "/gifs/storm.gif";
    else if (w.includes("mist") || w.includes("fog")) bg = "/gifs/fog.gif";
    else bg = "/gifs/clear.gif";

    document.body.style.backgroundImage = `url("${bg}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
}

//  Time + Date
function updateTime() {
    const el = document.getElementById("time-date");
    if (!el) return;

    function refresh() {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

        el.innerHTML = `
            <div>${time}</div>
            <div style="font-size:12px; opacity:0.7">${date}</div>
        `;
    }

    refresh();
    setInterval(refresh, 60000);
}

//  Display Weather
function displayWeather(data) {
    const { name, main, weather, wind, sys, visibility } = data;
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();

    weatherContainer.innerHTML = `
        <div class="bento-card main-card">
            <div id="time-date"></div>
            <h2>${name}</h2>
            <h1>${Math.round(main.temp)}°C</h1>
            <p>${weather[0].main}</p>
        </div>

        <div class="bento-card small-card">
            <h3>Feels Like</h3>
            <p>${Math.round(main.feels_like)}°C</p>
        </div>

        <div class="bento-card small-card">
            <h3>Humidity</h3>
            <p>${main.humidity}%</p>
        </div>

        <div class="bento-card small-card">
            <h3>Wind</h3>
            <p>${wind.speed} m/s</p>
        </div>

        <div class="bento-card small-card">
            <h3>Pressure</h3>
            <p>${main.pressure} hPa</p>
        </div>

        <div class="bento-card small-card">
            <h3>Sunrise</h3>
            <p>${sunrise}</p>
        </div>

        <div class="bento-card small-card">
            <h3>Sunset</h3>
            <p>${sunset}</p>
        </div>

        <div class="bento-card small-card">
            <h3>Visibility</h3>
            <p>${visibility / 1000} km</p>
        </div>
    `;

    updateBackground(weather[0].main);
    updateTime();

    // Animate small cards sequentially
const cards = document.querySelectorAll(".small-card");
cards.forEach((card, index) => {
    card.style.animation = `fadeInUp 0.8s ease forwards`; // slower
    card.style.animationDelay = `${0.5 * index + 0.5}s`; // more delay
});
}
//  Fetch Weather
async function fetchWeather() {
    const city = document.getElementById("city").value || "Addis Ababa";

    weatherContainer.innerHTML = `
        <div class="bento-card main-card loading">
            <h2>Loading...</h2>
        </div>
    `;

    try {
        const response = await fetch(`/weather?city=${city}`);
        const data = await response.json();

        if (!response.ok || data.cod !== 200) {
            weatherContainer.innerHTML = `
                <div class="bento-card main-card">
                    <h2>${data.message || "City not found"}</h2>
                </div>
            `;
            return;
        }

        displayWeather(data);

    } catch (err) {
        console.error(err);
        weatherContainer.innerHTML = `
            <div class="bento-card main-card">
                <h2>Failed to fetch data</h2>
            </div>
        `;
    }
}

// Load default
fetchWeather();