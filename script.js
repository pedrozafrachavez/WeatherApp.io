let weather = {
  apiKey: "089c8789124ab59704ac780629f0b313",
  fetchWeather: function(city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${this.apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.displayWeather(data);
        return data.name; // Return the city name for reuse in the forecast request
      })
      .then((cityName) => {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${this.apiKey}`;
        return fetch(forecastUrl);
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error occurred while fetching forecast data");
        }
      })
      .then((forecastData) => {
        this.displayForecast(forecastData);
      })
      .catch((error) => {
        console.log("Error occurred while fetching weather data:", error);
      });
  },
  displayWeather: function(data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { lon, lat } = data.coord;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src ="https://openweathermap.org/img/wn/" + icon + "@2x.png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°F";
    document.querySelector(".lon").innerText = "Longitude: " + lon + "";
    document.querySelector(".lat").innerText = "Latitude: " + lat + "";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind Speed: " + speed + "mph";
    document.querySelector(".weather").classList.remove("loading");
    document.querySelector(".lon").classList.remove("loading");

    document.body.style.backgroundImage = "url('https://source.unsplash.com/featured/?" + name + "')";
    document.getElementById('map').src = "https://www.bing.com/maps/embed?h=400&w=500&cp="+lat+"~"+lon+"&lvl=10&typ=d&sty=h&src=SHELL&FORM=MBEDV8";
  },
  displayForecast: function(data) {
    const forecastList = data.list;
    const filteredForecast = this.filterForecastByDay(forecastList, 3);

    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = "";

    filteredForecast.forEach((entry) => {
      const { dt, weather, main } = entry;

      const dateTime = new Date(dt * 1000);
      const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      const formattedDate = dateTime.toLocaleDateString(undefined, dateOptions);
      const iconCode = weather[0].icon;
      const temperature = main.temp;
      const weatherDescription = weather[0].description;

      const forecastElement = document.createElement("div");
      forecastElement.classList.add("weather-day");

      const html = `
        <div class="weather-date">${formattedDate}</div>
        <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon"></div>
        <div class="weather-temperature">${temperature}°F</div>
        <div class="weather-description">${weatherDescription}</div>
      `;

      forecastElement.innerHTML = html;
      forecastContainer.appendChild(forecastElement);
    });
  },
  filterForecastByDay: function(forecastList, numDays) {
    const filteredForecast = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < numDays; i++) {
      const filteredEntries = forecastList.filter((entry) => {
        const entryDateTime = new Date(entry.dt * 1000);
        const entryDate = new Date(
          entryDateTime.getFullYear(),
          entryDateTime.getMonth(),
          entryDateTime.getDate(),
          0,
          0,
          0,
          0
        );
        return entryDate.getTime() === today.getTime();
      });

      if (filteredEntries.length > 0) {
        filteredForecast.push(filteredEntries[0]);
      }

      today.setDate(today.getDate() + 1);
    }

    return filteredForecast;
  },
};

// Search button click event
document.querySelector(".search-button").addEventListener("click", function() {
  weather.fetchWeather(document.querySelector(".search-bar").value);
});

// Search bar Enter key press event
document.querySelector(".search-bar").addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    weather.fetchWeather(document.querySelector(".search-bar").value);
  }
});

// Fetch weather for initial city
weather.fetchWeather("98848");
