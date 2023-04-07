// npm run dev in terminal to run this application in browser

// import css style file
import "./style.css";
import { getWeather } from "./wind";
import { ICON_MAP } from "./iconMap";
// link to current location
navigator.geolocation.getCurrentPosition(positionSucces, positionError)

function positionSucces({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather).catch(e => {
      console.log(e)
      alert("Error getting weather information.")
    })
}

function positionError() {
  alert("There was an error getting your location. Please allow us to use your location and refresh the page")
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
  // remove blurred class over body when loaded
  document.body.classList.remove("blurred")
}

// helper function for the renderCurrentWeather function
function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.png`
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode)
  setValue("current-temp", current.currentTemp)
  setValue("current-high", current.highTemp)
  setValue("current-low", current.lowTemp)
  setValue("current-wind", current.windDirection)
  setValue("current-precip", current.precip)
}

function arrowRotate(elems, windDirection) {
  if (elems.length == 0) return;
  elems.forEach(function (el) {
    // windDirection + 180 is omdat image op de kop is
    el.style.transform = "rotate(" + (windDirection + 180) + "deg)"
  })
}

//run a formatter that will run just the day portion of the weekday
// short / long is the language quat spells out the day depending on the language of the user
const DAY_FORMATTER = Intl.DateTimeFormat(undefined, { weekday: "short" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
  dailySection.innerHTML = ""
  daily.forEach((day, index) => {
    // clone a template
    const element = dayCardTemplate.content.cloneNode(true)
    // set data temp within the just created clone
    setValue("temp", day.maxTemp, { parent: element })
    // format day as day not as date
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
    // get actual icon
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
    dailySection.append(element)
    arrowRotate([document.querySelectorAll('.green-arrow-day')[index]], (day.windDirection))

  })
}

const HOUR_FORMATTER = Intl.DateTimeFormat(undefined, { hour: "numeric" })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
  //take hourlySection and remove given html
  hourlySection.innerHTML = ""
  hourly.forEach((hour, index) => {
    const element = hourRowTemplate.content.cloneNode(true)
    setValue("temp", hour.temp, { parent: element })
    // ik denk windDirection, check of werkt
    setValue("wind", hour.windDirection, { parent: element })
    setValue("precip", hour.precip, { parent: element })
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element })
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element })
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
    hourlySection.append(element)
    arrowRotate([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection)

  })
}

// current wind-direction colour
// air-api tijdelijk gecomment want nieuwe functie is net als dit plus +
// if ("geolocation" in navigator) {
//   navigator.geolocation.getCurrentPosition(function (position) {
//     var lat = position.coords.latitude;
//     var lon = position.coords.longitude;

//     // Calculate the bearing between the current location and A
//     var bearing = calculateBearingOriginal(lat, lon, 52.4831765, 4.5729285);

//     // Calculate the opposite direction of the bearing to get the direction from A to the current location
//     var fromADeg = (bearing + 180) % 360;

//     // Get wind direction data from an API
//     fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${52.4831765}&lon=${4.5729285}&appid=97d43aa82bbe2a80042bef503d4d9a34`)
//       .then(response => response.json())
//       .then(data => {
//         var windDeg = data.wind.deg;

//         // Check if wind is blowing from A towards the current location
//         if (windBlowingFrom(windDeg, fromADeg)) {
//           // doX();
//           // call function to do X
//           document.getElementById("wind-direction").style.backgroundColor = "green";
//         } else {
//           document.getElementById("wind-direction").style.backgroundColor = "red";
//         }
//       });
//   });
// }

// function calculateBearingOriginal(lat1, lon1, lat2, lon2) {
//   // Convert coordinates to radians
//   var lat1Rad = deg2rad(lat1);
//   var lon1Rad = deg2rad(lon1);
//   var lat2Rad = deg2rad(lat2);
//   var lon2Rad = deg2rad(lon2);

//   // Calculate bearing using the Haversine formula
//   var y = Math.sin(lon2Rad - lon1Rad) * Math.cos(lat2Rad);
//   var x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad);
//   var bearingRad = Math.atan2(y, x);

//   // Convert bearing to degrees
//   var bearing = rad2deg(bearingRad);

//   return bearing;
// }

// function deg2rad(degrees) {
//   return degrees * (Math.PI / 180);
// }

// function rad2deg(radians) {
//   return radians * (180 / Math.PI);
// }

// function windBlowingFrom(windDeg, fromADeg) {
//   // Calculate the difference between the wind direction and the direction from A to the current location
//   var diff = windDeg - fromADeg;

//   // Adjust for negative angles
//   if (diff < -180) {
//     diff += 360;
//   } else if (diff > 180) {
//     diff -= 360;
//   }

//   // Check if the difference is between -90 and 90 degrees
//   return (diff >= -90 && diff <= 90);
// }



// function to do somthing with the input like change html class
// function doX() {
//   console.log('the wind is okey')
// }







// api + 6days 
// const apiKey = '97d43aa82bbe2a80042bef503d4d9a34'; // replace with your OpenWeatherMap API key
// const locationA = { lat: 52.4831765, lon: 4.5729285 }; // replace with your desired location A coordinates

// // function to get daily weather data for the next 7 days
// async function getDailyWeatherData() {
//   const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationA.lat}&lon=${locationA.lon}&exclude=current,minutely,hourly&units=metric&appid=${apiKey}`;
//   const response = await fetch(url);
//   const data = await response.json();
//   return data.daily;
// }

// // function to check if wind is blowing from location A towards current location
// function isWindBlowingFromLocationA(dailyWeatherData) {
//   const windDirection = dailyWeatherData[0].wind_deg;
//   const angleToLocationA = getAngleToLocationA();
//   const difference = angleToLocationA - windDirection;
//   if (difference > 180) {
//     return true;
//   } else {
//     return false;
//   }
// }

// // function to get the angle between the current location and location A
// function getAngleToLocationA() {
//   const lat1 = toRadians(locationA.lat);
//   const lon1 = toRadians(locationA.lon);
//   const lat2 = toRadians(currentLocation.lat);
//   const lon2 = toRadians(currentLocation.lon);

//   const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
//   const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
//   const angle = toDegrees(Math.atan2(y, x));

//   return (angle + 360) % 360;
// }

// // function to convert degrees to radians
// function toRadians(degrees) {
//   return degrees * (Math.PI / 180);
// }

// // function to convert radians to degrees
// function toDegrees(radians) {
//   return radians * (180 / Math.PI);
// }

// // function to update the background color of the wind direction element
// function updateWindDirectionColor(isBlowingFromLocationA) {
//   const windDirectionElement = document.querySelector('#wind-direction');
//   if (isBlowingFromLocationA) {
//     windDirectionElement.style.backgroundColor = 'red';
//   } else {
//     windDirectionElement.style.backgroundColor = 'green';
//   }
// }

// // get daily weather data for the next 7 days
// getDailyWeatherData()
// .then(data => {
//   for (let i = 0; i < data.length; i++) {
//     const weather = data[i];
//     const isBlowingFromLocationA = isWindBlowingFromLocationA(weather.wind_deg, weather.wind_speed);
//     const date = new Date(weather.dt * 1000); // convert Unix timestamp to JavaScript date
//     console.log(`Day ${i+1}: ${date.toLocaleDateString()} - Wind is blowing from location A: ${isBlowingFromLocationA}`);
//     updateWindDirectionColor(isBlowingFromLocationA);
//   }
// })
// .catch(error => {
//   console.error(error);
// });





// new timer function 

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    // Calculate the bearing between the current location and A
    var bearing = calculateBearing(lat, lon, 52.4831765, 4.5729285);

    // Calculate the opposite direction of the bearing to get the direction from A to the current location
    var fromADeg = (bearing + 180) % 360;

    // Get wind direction data from an API
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${52.4831765}&lon=${4.5729285}&appid=97d43aa82bbe2a80042bef503d4d9a34`)
      .then(response => response.json())
      .then(data => {
        var windDeg = data.wind.deg;

        // Check if wind is blowing from A towards the current location
        if (windBlowingFrom(windDeg, fromADeg)) {
          // doX();
          // call function to do X
          document.getElementById("wind-direction").style.backgroundColor = "green";
          document.getElementById("green-arrow-id").src = "images/green-arrow.svg";
        } else {
          document.getElementById("wind-direction").style.background = "linear-gradient(rgb(255, 112, 119), rgb(252, 74, 127))";
          document.getElementById("green-arrow-id").src = "images/red-arrow.svg";
          // Calculate the time until the wind direction changes towards the user from point A
          var timeToChange = calculateTimeToChange(windDeg, fromADeg);

          // Update the HTML element with the ID "wind-direction" to show the remaining time until the wind direction changes
          document.getElementById("wind-direction").innerHTML = "Time until wind direction change: " + timeToChange + " seconds";
          setInterval(function () {
            timeToChange--;
            document.getElementById("wind-direction").innerHTML = "Time until wind direction change: " + timeToChange + " seconds";
          }, 1000);
        }
      });
  });
}

function calculateBearing(lat1, lon1, lat2, lon2) {
  // Convert coordinates to radians
  var lat1Rad = deg2rad(lat1);
  var lon1Rad = deg2rad(lon1);
  var lat2Rad = deg2rad(lat2);
  var lon2Rad = deg2rad(lon2);

  // Calculate bearing using the Haversine formula
  var y = Math.sin(lon2Rad - lon1Rad) * Math.cos(lat2Rad);
  var x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad);
  var bearingRad = Math.atan2(y, x);

  // Convert bearing to degrees
  var bearing = rad2deg(bearingRad);

  return bearing;
}

function deg2rad(degrees) {
  return degrees * (Math.PI / 180);
}

function rad2deg(radians) {
  return radians * (180 / Math.PI);
}

function windBlowingFrom(windDeg, fromADeg) {
  // Calculate the difference between the wind direction and the direction from A to the current location
  var diff = windDeg - fromADeg;

  // Adjust for negative angles
  if (diff < -180) {
    diff += 360;
  } else if (diff > 180) {
    diff -= 360;
  }

  // Check if the difference is between -90 and 90 degrees
  return (diff >= -90 && diff <= 90);
}


function calculateTimeToChange(windDeg, fromADeg) {
  // Calculate the difference between the wind direction and the direction from A to the current location
  var diff = windDeg - fromADeg;

  // Adjust for negative angles
  if (diff < -180) {
    diff += 360;
  } else if (diff > 180) {
    diff -= 360;
  }

  // Calculate the time until the wind direction changes towards the user from point A
  var timeToChange = diff / 45; // assuming wind changes direction every 45 degrees

  // Return the time in minutes rounded to the nearest integer
  return Math.round(timeToChange * 60);
}

fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${52.4831765}&lon=${4.5729285}&appid=97d43aa82bbe2a80042bef503d4d9a34`)
  .then(response => response.json())
  .then(data => {
    var windDeg = data.wind.deg;

    // Check if wind is blowing from A towards the current location
    if (windBlowingFrom(windDeg, fromADeg)) {
      var timeToChange = calculateTimeToChange(windDeg, fromADeg);
      document.getElementById("wind-direction").innerHTML = `The wind will change direction in ${timeToChange} minutes`;
      document.getElementById("wind-direction").style.backgroundColor = "green";
    } else {
      document.getElementById("wind-direction").innerHTML = "The wind is not blowing from A towards your location";
      document.getElementById("wind-direction").style.background = "red";
    }
  });