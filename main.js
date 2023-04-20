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
      // console.log(e)
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

function arrowColor(elems) {
  if (elems.length == 0) return;
  elems.forEach(function (el) {
    // windDirection + 180 is omdat image op de kop is
    // el.style.backgroundColor = 'red'
    el.src = "images/red-arrow.svg";

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

    // verander naar Verander de if naar if wind direction from towards user
    // versimpeld om te testen samen met de console log
    // console.log(day.windDirection)
    if ((day.windDirection > 0 && day.windDirection < 40) || ((day.windDirection > 340 && day.windDirection < 360))) {
      // green-arrow-hour-id
      // document.getElementById("green-arrow-hour-id").style.background = "red";
      arrowColor([document.querySelectorAll('.green-arrow-day')[index]], day.windDirection)
    }

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



    // verander naar Verander de if naar if wind direction from towards user
    // versimpeld om te testen
    // console.log(hour.windDirection)
    if ((hour.windDirection > 0 && hour.windDirection < 40) || ((hour.windDirection > 300 && hour.windDirection < 360))) {
      // green-arrow-hour-id
      // document.getElementById("green-arrow-hour-id").style.background = "red";
      arrowColor([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection)
    }
  })
}


// working timer function only going -
var fromADeg; // Define the variable outside the callback function

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log(position)
    // console.log(position) // only gives long and lat

    // Calculate the bearing between the current location and A
    var bearing = calculateBearing(lat, lon, 52.4831765, 4.5729285);

    // Calculate the opposite direction of the bearing to get the direction from A to the current location
    var fromADeg = (bearing + 180) % 360;

    // Get wind direction data from an API
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${52.4831765}&lon=${4.5729285}&appid=97d43aa82bbe2a80042bef503d4d9a34`)
      .then(response => response.json())
      .then(data => {
        var windDeg = data.wind.deg;
        // console.log(data.name)
        // console.log(data.coord)



        // Check if wind is blowing from A towards the current location
        if (windBlowingFrom(windDeg, fromADeg)) {
          // doX();linear-gradient
          // call function to do X
          // document.getElementById("wind-direction").style.background = "linear-gradient( rgb(39, 255, 208), rgb(0, 255, 21))";
          document.getElementById("wind-direction").style.border = "2px solid rgb(0, 255, 21)";
          document.getElementById("green-arrow-id").src = "images/green-arrow.svg";
        } else {
          // document.getElementById("wind-direction").style.background = "linear-gradient(rgb(255, 112, 119), rgb(252, 74, 127))";
          document.getElementById("wind-direction").style.border = "2px solid rgb(255, 112, 119)";
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


// fetche is dubble but this edited so that it affects current wind and location

// Fetch forecasted weather data 
fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${52.4831765}&lon=${4.5729285}&appid=97d43aa82bbe2a80042bef503d4d9a34`)
  .then(response => response.json())
  .then(data => {
    // Extract forecasted wind direction for the next hour
    var windDeg = data.list[0].wind.deg;
    // console.log(data.city)
    //change current-location-id to current location with the data.city.name from the api
    document.getElementById("current-location-id").textContent = data.city.name;

    // Check if wind is blowing from A towards the current location
    if (windBlowingFrom(windDeg, fromADeg)) {
      var timeToChange = calculateTimeToChange(windDeg, fromADeg);
      updateTimer(timeToChange * 60); // convert time to seconds
      document.getElementById("wind-direction").style.backgroundColor = "green";

    } else {
      document.getElementById("wind-direction").innerHTML = "The wind is not blowing from tatasteel towards your location";
    }
  });

// new code updating timer
function updateTimer(secondsRemaining) {
  var timerElement = document.getElementById("wind-direction");
  if (secondsRemaining >= 0) {
    timerElement.innerHTML = "Wind direction will change in " + secondsRemaining + " seconds.";
    secondsRemaining--;
    setTimeout(function () { updateTimer(secondsRemaining); }, 1000);
  } else {
    timerElement.innerHTML = "";
  }
}


// new specific weather function die zelf geolocation van user pakt

// doet nu niets 

// function getWeatherData() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       var lat = position.coords.latitude;
//       var lon = position.coords.longitude;
//         var A_LAT = 52.4831765;
//         var A_LON = 4.5729285;
//       var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=97d43aa82bbe2a80042bef503d4d9a34`;

//       fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//           var windDeg = data.wind.deg;
//           var fromADeg = calculateBearing(lat, lon, A_LAT, A_LON);

//           // Check if wind is blowing from A towards the current location
//           if (windBlowingFrom(windDeg, fromADeg)) {
//             var timeToChange = calculateTimeToChange(windDeg, fromADeg);
//             var timeString = secondsToTimeString(timeToChange * 60);
//             document.getElementById("wind-direction").innerHTML = `The wind will change direction in ${timeString}`;
//             document.getElementById("wind-direction").style.backgroundColor = "green";
//           } else {
//             document.getElementById("wind-direction").innerHTML = "The wind is not blowing from A towards your location";
//             document.getElementById("wind-direction").style.background = "red";
//           }
//         });
//     });
//   } else {
//     console.log("Geolocation is not supported by this browser.");
//   }
// }
// getWeatherData()

















// improved versie ervan proberen , deze is ook zelfde als eerste code hiervoor, als dit werkt mag alle andere ai code weg


// function calculateTimeToChange(lat, lon) {
//   const API_KEY = '97d43aa82bbe2a80042bef503d4d9a34';
//   const endpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

//   fetch(endpoint)
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error('Network response was not ok.');
//     })
//     .then((data) => {
//       const windBlowingFrom = data.list[0].wind.deg;
//       const timeToChange = calculateBeating(windBlowingFrom, data.city.coord.lat, data.city.coord.lon, lat, lon);
//       const timeToChangeString = secondsToTimeString(timeToChange);
//       updateTimer(timeToChangeString);
//     })
//     .catch((error) => {
//       console.error('There has been a problem with your fetch operation:', error);
//     });
// }

// function calculateBeating(windDegrees, lat1, lon1, lat2, lon2) {
//   const R = 6371e3; // metres
//   const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
//   const φ2 = (lat2 * Math.PI) / 180;
//   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//   const Δλ = ((lon2 - lon1) * Math.PI) / 180;
//   const θ = Math.atan2(
//     Math.sin(Δλ) * Math.cos(φ2),
//     Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
//   ); // θ in radians
//   let direction = (θ * 180) / Math.PI; // degrees
//   if (direction < 0) {
//     direction += 360;
//   }
//   const bearing = (windDegrees - direction + 360) % 360;
//   const beating = (bearing / 180) * Math.PI; // radians
//   const distance = Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * R; // metres
//   const timeToChange = distance / (Math.sin(beating) * 10); // seconds
//   return timeToChange;
// }

// function secondsToTimeString(seconds) {
//   const days = Math.floor(seconds / (24 * 60 * 60));
//   const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
//   const minutes = Math.floor((seconds % (60 * 60)) / 60);
//   const secondsLeft = seconds % 60;
//   let timeString = '';
//   if (days > 0) {
//     timeString += `${days} day${days > 1 ? 's' : ''}, `;
//   }
//   if (hours > 0) {
//     timeString += `${hours} hour${hours > 1 ? 's' : ''}, `;
//   }
//   if (minutes > 0) {
//     timeString += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
//   }
//   timeString += `${secondsLeft} second${secondsLeft > 1 ? 's' : ''}`;
//   return timeString;
// }

// function updateTimer(timeString) {
//   const timerElement = document.getElementById('timer');
//   timerElement.textContent = `Time to change: ${timeString}`;
// }








