// DEFINING VARIABLES

const userInput = $("#userInput");
const searchBtn = $("#searchBtn");
const apiKey = "af8df023e716fa9cc10ee93697bcbff5";
const cityEl = $("#city");
const tempEl = $(".temp");
const humidityEl = $(".humidity");
const windEl = $(".wind");
const uvEl = $(".uv");

// WHEN THE SEARCH BUTTON IS CLICKED

searchBtn.click(function () {
  getLocation();
});

// FUNCTION TO ACCESS WEATHER API

function getLocation() {
  // get city
  let searchCity = userInput.val();
  
  // request api based on city name
  return (
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${apiKey}`
    )
      .then(function (promiseresult) {
        // if search is invalid alert user
        if (promiseresult.status > 400) {
          alert("city not found");
        }
        
        // else return promise
        const data = promiseresult.json();
        return data;
      })
      
      // use city name to get longtitude and latitude
      .then(function (data) {
        const cityLon = data.coord.lon;
        const cityLat = data.coord.lat;
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=metric`
        )
          .then(function (currentWeather) {
            const locationWeather = currentWeather.json();

            return locationWeather;
          })
          
          // parse response and collect information
            .then(function (locationWeather) {
            const weather = locationWeather.current;
            const temp = weather.temp;
            const humidity = weather.humidity;
            const wind = weather.wind_speed;
            const uv = weather.uvi;
            const timezone = locationWeather.timezone;
            const currentDate = moment(weather.dt, "X").format("DD");
            console.log(currentDate);
            
            // populate current city table
            $(cityEl).text(timezone);
            $(tempEl).text(temp + "°");
            $(humidityEl).text(humidity + "%");
            $(windEl).text(wind + "km/h");
            $(uvEl).text(uv);

            // add city to search history
            const cityData = [{
                temp: weather.temp,
                humidity: weather.humidity,
                wind: weather.wind_speed,
                uv: weather.uvi,
            }]
            localStorage.setItem(searchCity, JSON.stringify(cityData))
            const historyEL = $("#history");
            const historyBtn = $("<button>");
            $(historyBtn).attr("class", "btn btn-secondary w-100");

            $(historyBtn).text(searchCity);
            $(historyEL).append(historyBtn, "<br>");
          });
      })
  );
}
