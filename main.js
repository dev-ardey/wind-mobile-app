// npm run dev in terminal to run this application in browser


// delaying request rate with 2 seconds to prevent API block
function makeAPIRequest() {
  // make API request with API key
  fetch('https://api.openweathermap.org/data/2.5/weather?lat=52.4831765&lon=4.5729285&appid=97d43aa82bbe2a80042bef503d4d9a34')
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

    // if

    // if 

    // if 

    // if
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


    //werkende daily hardcoded
    if ((day.windDirection > 0 && day.windDirection < 40) || ((day.windDirection > 340 && day.windDirection < 360))) {
      // comented out tot hour goed is
      // arrowColor([document.querySelectorAll('.green-arrow-day')[index]], day.windDirection)
    }

  })
}

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
    const pointTata = { lat: 52.4831765, lon: 4.5729285 };
    console.log(lat)
    console.log(lon)
    console.log(userCurrentLocation)
    console.log(pointTata)
    console.log(pointTata)

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
    console.log("the wind from tata is " + windFromTata)


    hourly.forEach((hour, index) => {
      const element = hourRowTemplate.content.cloneNode(true)
      setValue("temp", hour.temp, { parent: element })
      setValue("wind", hour.windDirection, { parent: element })
      setValue("precip", hour.precip, { parent: element })
      setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element })
      setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element })
      element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
      hourlySection.append(element)
      arrowRotate([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection)
      // console.log(hour.windDirection)
      const newWindDirection = hour.windDirection
      // change it so this function that creates a beating instead of deg
      // function windBlowingFrom(newWindDirection, userCurrentLocation) {
      //   // Calculate the difference between the wind direction and the direction from Tata to the current location
      //   var diff = newWindDirection - userCurrentLocation;

      //   // Adjust for negative angles
      //   if (diff < -180) {
      //     diff += 360;
      //   } else if (diff > 180) {
      //     diff -= 360;
      //   }

      //   // Check if the difference is between -90 and 90 degrees
      //   return (diff >= -90 && diff <= 90);
      // }

      // console.log(windFromTata)
      // console.log(newWindDirection)
      // console.log(Math.round(windFromTata))
      // const calculatedDirection = (newWindDirection +169) == (Math.round(windFromTata));
      // test calculatedDirection by looking at a deg in hour. Then windFromTata - that deg. and add it to newWindDirection
      // for example a deg in hour is 32deg.  windFromTata(201) - 32 = 169. now (newWindDirection + 104)
      const calculatedDirection = (newWindDirection + 79) == (Math.round(windFromTata));

      // see if i can create 
      // const tataWindRange = (windFrom Tata - 20deg || windFrom Tata + 20deg) 
      // const calculatedBearingDirection = (newWindDirection is inside tataWindRange);
      // if (calculatedBearingDirection == true) {
      //   arrowColor([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection);
      // }




      //rangeFunction sort of works


      // rangeFunction
      // function rangeFunction() {
      //   const tataWind = Math.round(windFromTata);
      //   // adding degrees to a total of 40deg
      //   const tataWindHigh = ((tataWind) + 20);
      //   const tataWindLow =  ((tataWind) - 20);
      //   const controleNum1 = 136;
      //   const controleNum2 = 115;
      //   const finalNum = newWindDirection;
      //   console.log(newWindDirection)
      //   // console.log(tataWind)



      //   const result1 = (controleNum1 >= tataWindLow && controleNum1 <= tataWindHigh);
      //   const result2 = (controleNum2 >= tataWindLow && controleNum2 <= tataWindHigh);
      //   const finalResult = (finalNum >= tataWindLow && finalNum <= tataWindHigh);
      //   // console.log(finalResult)
      //   // finalResult ? console.log("true") : console.log("false")

      //   // console.log(result1 ? "true" : "false");
      //   // console.log(result2 ? "true" : "false");
      //   // console.log(finalResult ? "true" : "false");
      //   if (finalResult == true) {
      //     arrowColor([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection);

      //   }

      // }
      // rangeFunction();




      // improved version of the rangeFunction (simpeler + shorter)


      //       function calculateWindDirectionRange(windFromTata) {
      //         //windFromTata flipped 180 so that 
      //         const tataWind = Math.round(windFromTata +180);
      //         const tataWindHigh = tataWind + 120;
      //         const tataWindLow = tataWind - 120;
      //         // maby the problem is that this calculation is based on normal math, not on math with 360 as a max?
      //         //if tatawindHigh higer than 360. start with 0 and add the rest
      //         //if tataWindLow lower than 0. start with 360 and subtracs the rest

      //         return { min: tataWindLow, max: tataWindHigh };
      //       }

      //       const windDirectionRange = calculateWindDirectionRange(windFromTata);
      // // const newWindDirection = 150; // example wind direction value

      // if (newWindDirection >= windDirectionRange.min && newWindDirection <= windDirectionRange.max) {
      //   // The wind direction is within the valid range
      //           arrowColor([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection);
      //     } else {
      //   // The wind direction is outside the valid range
      //   console.log('Wind direction is outside the valid range');
      // }





      // rangeFunction with modulo operator almost working

      // function rangeFunction() {
      //   const tataWind = Math.round(windFromTata);
      //   // adding degrees to a total of 40deg
      //   let tataWindHigh = (windFromTata + 40) % 360;
      //   let tataWindLow = (windFromTata - 40 + 360) % 360;

      //   if (tataWindHigh < tataWindLow) {
      //     const tataWindHigh1 = 360;
      //     const tataWindLow1 = tataWindLow;
      //     tataWindLow = 0;
      //     const range1 = [tataWindLow1, 360];
      //     const range2 = [0, tataWindHigh];
      //     // console.log("Range: ", range1, range2);
      //   } else {
      //     const range = [tataWindLow, tataWindHigh];
      //     // console.log("Range: ", range);
      //   }

      //   // zojuist deze code gepaste, check of het werkt en of het werkt samen met eigen code
      //   console.log(windFromTata)
      //   const tataWindBearing = (90 - windFromTata) % 360;
      //   // console.log(tataWindBearing)


      //   const controleNum1 = 136;
      //   const controleNum2 = 115;
      //   const finalNum = newWindDirection;
      //   // console.log(newWindDirection)

      //   // Check if tataWindHigh is greater than or equal to 360
      //   if (tataWindHigh >= 360) {
      //     tataWindHigh = tataWindHigh % 360;
      //   }

      //   // Check if tataWindLow is less than 0
      //   if (tataWindLow < 0) {
      //     tataWindLow = 360 + (tataWindLow % 360);
      //   }

      //   const result1 = (controleNum1 >= tataWindLow && controleNum1 <= tataWindHigh);
      //   const result2 = (controleNum2 >= tataWindLow && controleNum2 <= tataWindHigh);
      //   const finalResult = (finalNum >= tataWindLow && finalNum <= tataWindHigh);

      //   if (finalResult == true) {
      //     arrowColor([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection);
      //   }
      // }
      // rangeFunction();





      // implementing current code with hour variables

      console.log(windFromTata)
      // console.log(newWindDirection)

      function hourWindBlowingFrom(newWindDirection, windFromTata) {
        // Calculate the difference between the wind direction and the direction from A to the current location
        var diffTata = newWindDirection - (windFromTata + 180);
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

      if (hourWindBlowingFrom(newWindDirection, windFromTata)) {
        // console.log("hourly arrows should be green ")
        arrowColor([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection);

      }
      else {
        // console.log("hourly arrows should be red ")
      }



      // code versimpelen


      // tijdelijk uitgezet,
      // console.log(newWindDirection) r242
      // console.log(tataWind)  r243
      // console.log(finalResult) r250
      // voordat ik die weer aanzet om pijltjes te testen. TEST EERST CURRENT LOCATION, die moet mee veranderen met de browser
      // de geolocations moeten verandern.
      // console.log(userCurrentLocation)
      // no override      52.4588487, lon: 4.6108897
      // ijmuiden strand  52.455214, lon: 4.555571
      // heemskerk        52.509466, lon: 4.677003
      // dat betekend dat de coordinaten het doen.

      // console log tatawind = 67




      // if (calculatedDirection == true) {
      //   arrowColor([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection);
      // }


      // // rangeFunction
      // function rangeFunction() {
      //   const testNum = 136;
      //   const numHigh = testNum + 20;
      //   const numLow = testNum - 20;
      //   const controleNum1 = 136;
      //   const controleNum2 = 115;

      //   const result1 = (controleNum1 >= numLow && controleNum1 <= numHigh);
      //   const result2 = (controleNum2 >= numLow && controleNum2 <= numHigh);

      //   console.log(result1 ? "true" : "false");
      //   console.log(result2 ? "true" : "false");
      // }
      // rangeFunction();



      // old if code to test if hour arrows work
      // if ((hour.windDirection > 0 && hour.windDirection < 40) || ((hour.windDirection > 300 && hour.windDirection < 360))) {
      //   arrowColor([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection)
      // }

      // not working bearing code but maby i can use it to get a range instead of 1 deg
      // // console.log(bearingFromWindToUser)
      // if (Math.abs(bearing - bearingFromWindToUser) <= 180) {
      //   arrowColor([document.querySelectorAll('.green-arrow-hour')[index]], hour.windDirection);
      // }
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

    // Calculate the bearing between the current location and A
    var bearing = calculateBearing(lat, lon, 52.4831765, 4.5729285);

    // Calculate the opposite direction of the bearing to get the direction from A to the current location
    var fromADeg = (bearing + 180) % 360;
    // console.log(fromADeg)



    // data api changing function
    // Get wind direction data from an API
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${52.4831765}&lon=${4.5729285}&appid=97d43aa82bbe2a80042bef503d4d9a34`)
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
  console.log(windDeg)

  // Adjust for negative angles
  if (diff < -180) {
    diff += 360;
  } else if (diff > 180) {
    diff -= 360;
  }

  // Check if the difference is between -90 and 90 degrees
  return (diff >= -90 && diff <= 90);
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
