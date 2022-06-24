// DEFINING VARIABLES

const userInput = $("#userInput");
const searchBtn = $("#searchBtn");
const apiKey = "af8df023e716fa9cc10ee93697bcbff5";
const cityEl = $("#city");
const tempEl = $(".temp");
const humidityEl = $(".humidity");
const windEl = $(".wind");
const uvEl = $(".uv");
const forecastEl = $("#five-day")
const conditionsEl = $("<img>")

// WHEN THE SEARCH BUTTON IS CLICKED

searchBtn.click(function () {
  $(conditionsEl).attr("src", "")
  let searchCity = userInput.val();
  getLocation(searchCity);
});

// FUNCTION TO ACCESS WEATHER API

function getLocation(searchCity) {
  $(forecastEl).empty()
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
            
            // create weather image depending on conditions
            const weatherCon = weather.weather
            const conditions = weatherCon[0].main
            const conditionsDiv = $("#conditions")
            
            $(conditionsDiv).append(conditionsEl)
            if(conditions === "Clouds") {
              $(conditionsEl).attr("src", "http://openweathermap.org/img/wn/02d@2x.png")
            }
            if(conditions === "Clear") {
              $(conditionsEl).attr("src", "http://openweathermap.org/img/wn/01d@2x.png")
            }
            if(conditions === "Rain") {
              $(conditionsEl).attr("src", "http://openweathermap.org/img/wn/10d@2x.png")
            }
            if(conditions === "Thunderstorm") {
              $(conditionsEl).attr("src", "http://openweathermap.org/img/wn/11d@2x.png")
            }

            
            // populate current city table
            $(cityEl).text(timezone);
            $(tempEl).text(temp + "°");
            $(humidityEl).text(humidity + "%");
            $(windEl).text(wind + "km/h");
            $(uvEl).text(uv);

            // GET 5 DAY FORECAST

            fetch(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=metric`
            )
              .then(function (forecast) {
                const fiveDay = forecast.json();
                return fiveDay;
              })
              .then(function (fiveDay) {
                const weekPlan = fiveDay.list;
                
                // get date
                const date0 = weekPlan[7]
                const date1 = weekPlan[14]
                const date2 = weekPlan[21]
                const date3 = weekPlan[28]
                const date4 = weekPlan[35]
                
                // get weather info from date
                const day0 = weekPlan[7].main;
                const day1 = weekPlan[14].main;
                const day2 = weekPlan[21].main;
                const day3 = weekPlan[28].main;
                const day4 = weekPlan[35].main;
                
                // loop for 5 days
                let count = "";
                for (let index = 0; index < 5; index++) {
                  let count = eval("day" + index);
                  let date = eval("date" + index);
                
                  // set variables for weather info
                  const weekDate = moment(date.dt, "X").format("MMMM Do")
                  const weekTemp = count.temp;
                  const weekHumidity = count.humidity;
                  const weekWind = weekPlan[index].wind.speed;
                  
                  
                  
                  // create info in DOM
                  
                  const dayDiv = $("<div>");
                  $(dayDiv).attr("class", "col-2 bg-dark m-1 text-light");
                  const forecastCityEl = $("<h5>");
                  $(forecastCityEl).attr("class", "text-info card-title")
                  const dateTitleEl = $("<h5>");
                  const weekTempEl = $("<p>");
                  const weekHumidityEl = $("<p>");
                  const weekWindEl = $("<p>");
                  $(forecastCityEl).text(searchCity.toUpperCase())
                  $(dayDiv).append(forecastCityEl)
                  $(dateTitleEl).text(weekDate)
                  $(weekTempEl).text("Temp: " + weekTemp + "°")
                  $(weekHumidityEl).text("Humidity: " + weekHumidity + "%")
                  $(weekWindEl).text("Wind speed: " + weekWind + "km/h")
                  $(dayDiv).append(dateTitleEl)
                  $(dayDiv).append(weekTempEl)
                  $(dayDiv).append(weekHumidityEl)
                  $(dayDiv).append(weekWindEl)
                  $(forecastEl).append(dayDiv)
                  

                }
              });

            // add city to search history
            const cityData = [
              {
                temp: weather.temp,
                humidity: weather.humidity,
                wind: weather.wind_speed,
                uv: weather.uvi,
                cond: conditions,
              },
            ];
            localStorage.setItem(searchCity, JSON.stringify(cityData));

            // create history in DOM
            const historyEL = $("#history");
            const historyBtn = $("<button>");
            $(historyBtn).attr("class", "btn btn-secondary w-100");
            $(historyBtn).attr("id", "previous")
            $(historyBtn).text(searchCity.toUpperCase());
            $(historyEL).append(historyBtn, "<br>");
          
            $(historyBtn).click(function() {
              const previousCity = $(historyBtn).text()
              getLocation(previousCity);
            })
          });
      })
  );
}

