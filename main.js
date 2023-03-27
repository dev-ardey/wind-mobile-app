// npm run dev in terminal to run this application in browser

// import css style file
import "./style.css";
import { getWeather } from "./wind";
import { ICON_MAP } from "./iconMap"

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
  return `icons/${ICON_MAP.get(iconCode)}.svg`
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

//run a formatter that will run just the day portion of the weekday
// short / long is the language quat spells out the day depending on the language of the user
const DAY_FORMATTER = Intl.DateTimeFormat(undefined, { weekday: "short" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
  dailySection.innerHTML = ""
  daily.forEach(day => {
    // clone a template
    const element = dayCardTemplate.content.cloneNode(true)
    // set data temp within the just created clone
    setValue("temp", day.maxTemp, { parent: element })
    // format day as day not as date
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
    // get actual icon
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
    dailySection.append(element)
  })
}

const HOUR_FORMATTER = Intl.DateTimeFormat(undefined, { hour: "numeric" })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
  //take hourlySection and remove given html
  hourlySection.innerHTML = ""
  hourly.forEach(hour => {
    const element = hourRowTemplate.content.cloneNode(true)
    setValue("temp", hour.temp, { parent: element })
    // ik denk windDirection, check of werkt
    setValue("wind", hour.windDirection, { parent: element })
    setValue("precip", hour.precip, { parent: element })
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element })
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element })
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
    hourlySection.append(element)
  })
}






