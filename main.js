// npm run dev in terminal to run this application in browser

const coordintes = {
  //default is old incorrect location
  default: {
    lat: 52.4831765, lon: 4.5729285
  },
  tata_steel: {
    lat: 52.478089, lon: 4.592505
  }
}

// delaying request rate with 2 seconds to prevent API block
function makeAPIRequest() {
  // make API request with API key
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordintes.tata_steel.lat}&lon=${coordintes.tata_steel.lon}&appid=97d43aa82bbe2a80042bef503d4d9a34`)
    .then(response => response.json())
    .then(data => {
      // handle API response data
    })
    .catch(error => console.error(error));

  // add delay before making the next request
  setTimeout(() => {
    makeAPIRequest();
  }, 2000); // delay of 2 seconds
}

// call the function to start making API requests
makeAPIRequest();

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
      // alert("Error getting weather information. " + error.message)
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
  // maby i can use something like this to rotate green-arrow-id?
  arrowRotate(document.querySelectorAll('.green-arrow-current'), current.windDirection)
  //  arrowColor(document.querySelectorAll('.green-arrow-current'), current.windDirection)
  // console.log(current.windDirection)

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

// new function that selects a new image for the fitting coordinates, in hour maak een if (wind is 350 - 20) { geef src img map-0}
// function imageSelector(elems, windDirection) {
//   if (elems.length == 0) return;
//   elems.forEach(function (el) {
//     document.getElementById("temp-map-img").src = "images/green-arrow.svg";
//    if ((day.windDirection > 0 && day.windDirection < 40) || ((day.windDirection > 340 && day.windDirection < 360))) {
//   arrowColor([document.querySelectorAll('.green-arrow-day')[index]], day.windDirection)
// }
//   })
// }

// test new function with if statement
function imageSelector(elems, windDirection) {
  if (elems.length == 0) return;
  elems.forEach(function (el) {
    // if wind is pointing to 0 deg
    if ((hour.windDirection > 340 && hour.windDirection < 360) || ((hour.windDirection > 0 && hour.windDirection < 40))) {
      document.getElementById("temp-map-img").src = "images/map-0.png";
    }
    // add all other directions

    // if{
    //  if (windspeed <= 50???) {use smaller flow image}
    //  else { normal img}
    // }

    // if 

    // if 

    // if
  })
}

// old daily
// const DAY_FORMATTER = Intl.DateTimeFormat(undefined, { weekday: "short" })
// const dailySection = document.querySelector("[data-day-section]")
// const dayCardTemplate = document.getElementById("day-card-template")
// function renderDailyWeather(daily) {
//   dailySection.innerHTML = ""
//   daily.forEach((day, index) => {
//     // clone a template
//     const element = dayCardTemplate.content.cloneNode(true)
//     // set data temp within the just created clone
//     setValue("temp", day.maxTemp, { parent: element })
//     // format day as day not as date
//     setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
//     // get actual icon
//     element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
//     dailySection.append(element)
//     arrowRotate([document.querySelectorAll('.green-arrow-day')[index]], (day.windDirection))


//     //werkende daily hardcoded
//     if ((day.windDirection > 0 && day.windDirection < 40) || ((day.windDirection > 340 && day.windDirection < 360))) {
//       // comented out tot hour goed is
//       // arrowColor([document.querySelectorAll('.green-arrow-day')[index]], day.windDirection)
//     }

//   })
// }



const DAY_FORMATTER = Intl.DateTimeFormat(undefined, { weekday: "short" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
  //take daySection and remove given html
  // console.log(daily)

  dailySection.innerHTML = ""

  navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    const userCurrentLocation = { lat, lon };
    const pointTata = { ...coordintes.tata_steel };
    // console.log("daily lat : " + lat)
    // console.log("daily lon : " + lon)
    // console.log(userCurrentLocation)
    // console.log(pointTata)

    function bearing(lat1, lon1, lat2, lon2) {
      const dLon = (lon2 - lon1) * Math.PI / 180;

      const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
      const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) - Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);

      let brng = Math.atan2(y, x) * 180 / Math.PI;

      if (brng < 0) {
        brng += 360;
      }

      return brng;
    }



    const windFromTata = bearing(pointTata.lat, pointTata.lon, userCurrentLocation.lat, userCurrentLocation.lon);
    // console.log("the wind from tata is " + windFromTata)

    daily.forEach((day, index) => {
      const element = dayCardTemplate.content.cloneNode(true)
      setValue("temp", day.maxTemp, { parent: element })
      setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
      element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
      dailySection.append(element)
      arrowRotate([document.querySelectorAll('.green-arrow-day')[index]], (day.windDirection))
      const newWindDirection = day.windDirection
      // console.log(windFromTata)
      // console.log(newWindDirection)

      // wind blowing from tata to user function
      function dayWindBlowingFrom(newWindDirection, windFromTata) {
        // Calculate the difference between the wind direction and the direction from A to the current location
        var diffTata = newWindDirection - (windFromTata + 180);
        // console.log("newest wind from tata is " + windFromTata)
        // console.log(newWindDirection)
        // Adjust for negative angles
        if (diffTata < -180) {
          diffTata += 360;
        } else if (diffTata > 180) {
          diffTata -= 360;
        }

        // Check if the difference is between -90 and 90 degrees
        return (diffTata >= -22.5 && diffTata <= 22.5);
      }

      if (dayWindBlowingFrom(newWindDirection, windFromTata)) {
        // console.log("daily arrows should be green ")
        arrowColor([document.querySelectorAll('.green-arrow-day')[index]], day.windDirection);
        // console.log(windFromTata)


        // FUNCTIE LIJKT HET TE DOEN MAAR MAAKT GEEN CONNECTIE MET GREEN ARROW DAY
      }
      //als ik volgende functie gebruik met zelfde outcome geeft ie wel correcte pijlen
      // dus of functie zelf is niet goed, foutje gemaakt ergens, of hij laat verkeerde pijen zien / windfromtata + 180? of iets anders?
      // if ((day.windDirection > 0 && day.windDirection < 40) || ((day.windDirection > 340 && day.windDirection < 360))) {
      //   //       // comented out tot hour goed is
      //         arrowColor([document.querySelectorAll('.green-arrow-day')[index]], day.windDirection)
      //       }

    })
  })
}














const expectedChanges = []

const HOUR_FORMATTER = Intl.DateTimeFormat(undefined, { hour: "numeric" })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
  //take hourlySection and remove given html
  hourlySection.innerHTML = ""

  navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    const userCurrentLocation = { lat, lon };
    const pointTata = { ...coordintes.tata_steel };
    // console.log("hourly lat : " + lat)
    // console.log("hourly lat : " + lon)
    // console.log(userCurrentLocation)
    // console.log(pointTata)

    function bearing(lat1, lon1, lat2, lon2) {
      const dLon = (lon2 - lon1) * Math.PI / 180;

      const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
      const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) - Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);

      let brng = Math.atan2(y, x) * 180 / Math.PI;

      if (brng < 0) {
        brng += 360;
      }

      return brng;
    }



    const windFromTata = bearing(pointTata.lat, pointTata.lon, userCurrentLocation.lat, userCurrentLocation.lon);
    // console.log("the wind from tata is " + windFromTata)


    hourly.forEach((hour, index) => {
      const element = hourRowTemplate.content.cloneNode(true)
      setValue("temp", hour.temp, { parent: element })
      // wind set value is for user to see where the winddirection is flowing towards
      // setValue("wind", (hour.windDirection - 180), { parent: element })
      // maar probleem is hij ziet het niet als 360 max, dus verander het zo met een berrekening dat als over 360 is dat ie vanaf 0 gaat en omgekeerd
      setValue("wind", (hour.windDirection), { parent: element })
      setValue("precip", hour.precip, { parent: element })
      setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element })
      setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element })

      element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
      hourlySection.append(element)

      arrowRotate([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection)
      const newWindDirection = hour.windDirection
      // console.log(windFromTata)
      // console.log(newWindDirection)

      // wind blowing from tata to user function
      function hourWindBlowingFrom(newWindDirection, windFromTata) {
        // Calculate the difference between the wind direction and the direction from A to the current location
        var diffTata = newWindDirection - (windFromTata + 180);
        // console.log(newWindDirection)
        // console.log(index, diffTata, newWindDirection, windFromTata)
        // Adjust for negative angles
        if (diffTata < -180) {
          diffTata += 360;
        } else if (diffTata > 180) {
          diffTata -= 360;
        }

        // Check if the difference is between -90 and 90 degrees
        return (diffTata >= -22.5 && diffTata <= 22.5);
      }

      if (hourWindBlowingFrom(newWindDirection, windFromTata)) {
        //expectedChanges cathes i
        expectedChanges.push(index + 1)

        // console.log("hourly arrows should be green ")
        arrowColor([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection);

      }

      //
      if (index === hourly.length - 1) {
        // use expectedChanges  i for X
        console.log({ expectedChanges })
        // (expectedChanges[0] -1) is minus current hour
        if ((expectedChanges[0] -1) == true ){
        document.getElementById("hours-until-change-id").innerHTML = (expectedChanges[0] -1) + " hour";
        }
        else {
          document.getElementById("hours-until-change-id").innerHTML = (expectedChanges[0] -1) + " hours";
          }
      }

    })
  })
}


// console.log(fromADeg)
// working timer function only going -
var fromADeg; // Define the variable outside the callback function
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    // console.log(position) // only gives long and lat
    // console.log("2nd api lat = " + lat)
    // console.log("2nd api lat = " + lon)

    // Calculate the bearing between the current location and A
    var bearing = calculateBearing(lat, lon, coordintes.tata_steel.lat, coordintes.tata_steel.lon);

    // Calculate the opposite direction of the bearing to get the direction from A to the current location
    var fromADeg = (bearing + 180) % 360;
    // console.log(fromADeg)



    // data api changing function
    // Get wind direction data from an API
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordintes.tata_steel.lat}&lon=${coordintes.tata_steel.lon}&appid=97d43aa82bbe2a80042bef503d4d9a34`)
      .then(response => response.json())
      .then(data => {
        var windDeg = data.wind.deg;
        // console.log(data)

        // Check if wind is blowing from A towards the current location
        if (windBlowingFrom(windDeg, fromADeg)) {
          // doX();linear-gradient
          // call function to do X
          // console.log("current arrow should be green ")
          // document.getElementById("wind-direction").style.background = "linear-gradient( rgb(39, 255, 208), rgb(0, 255, 21))";
          document.getElementById("wind-direction").style.border = "2px solid rgb(0, 255, 21)";
          document.getElementById("green-arrow-id").src = "images/green-arrow.svg";
          document.getElementById("wind-direction").innerHTML = "The wind from tatasteel is not blowing towards your location";
        } else {
          // console.log("current arrow should be red ")
          // document.getElementById("wind-direction").style.background = "linear-gradient(rgb(255, 112, 119), rgb(252, 74, 127))";
          document.getElementById("wind-direction").style.border = "2px solid rgb(255, 112, 119)";
          document.getElementById("green-arrow-id").src = "images/red-arrow.svg";
          document.getElementById("wind-direction").innerHTML = "The wind from tatasteel is blowing towards your location";
          // Calculate the time until the wind direction changes towards the user from point A
          // var timeToChange = calculateTimeToChange(windDeg, fromADeg);
          // updateTimer(timeToChange * 60); 
          // convert time to seconds

          // Update the HTML element with the ID "wind-direction" to show the remaining time until the wind direction changes
          // document.getElementById("wind-direction").innerHTML = "Time until wind direction change: " + timeToChange + " seconds";
          // setInterval(function () {
          //   timeToChange--;
          //   document.getElementById("wind-direction").innerHTML = "Time until wind direction change: " + timeToChange + " seconds";
          // }, 1000);
        }
      });
  });
}

// even functies veranderen terug roepen tijd functie


// new code updating timer

// de if statement doet nu niets in deze functie
// function updateTimer(secondsRemaining) {
//   // why is secondsRemaining -9240???
//   // volgends mij zegt secondsRemaining helemaal niets
//   console.log(secondsRemaining)

//   var timerElement = document.getElementById("wind-direction");
//   if (secondsRemaining >= 0) {
//     timerElement.innerHTML = "Wind direction will change in " + secondsRemaining + " seconds.";
//     secondsRemaining--;
//     setTimeout(function () { updateTimer(secondsRemaining); }, 1000);
//   } else {
//     timerElement.innerHTML = "";
//   }
// }



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
  // console.log(bearing)
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
  // console.log(windDeg)

  // Adjust for negative angles
  if (diff < -180) {
    diff += 360;
  } else if (diff > 180) {
    diff -= 360;
  }

  // Check if the difference is between -22.5 and 22.5, but bearing is flipped so 180 - 22.5 = 157.5
  return (diff >= -157.5 && diff <= 157.5);
}


// function calculateTimeToChange(windDeg, fromADeg) {
//   // Calculate the difference between the wind direction and the direction from A to the current location
//   var diff = windDeg - fromADeg;

//   // Adjust for negative angles
//   if (diff < -180) {
//     diff += 360;
//   } else if (diff > 180) {
//     diff -= 360;
//   }

//   // Calculate the time until the wind direction changes towards the user from point A
//   var timeToChange = diff / 45; // assuming wind changes direction every 45 degrees

//   // Return the time in minutes rounded to the nearest integer
//   return Math.round(timeToChange * 60);
// }

