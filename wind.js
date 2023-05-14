import axios from "axios"

export function getWeather(lat, lon, timezone) {
    console.log("party location = " + lat)
    return axios
        .get(
            "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,precipitation,weathercode,winddirection_10m,winddirection_80m,winddirection_120m,winddirection_180m,windgusts_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,winddirection_10m_dominant&current_weather=true&timeformat=unixtime",
            {
                params: {
                    latitude: lat,
                    longitude: lon,
                    timezone,
                }
            })

        .then(({ data }) => {
            // exampleof parse daily time.map
            // return data
            // console.log(data)
            return {
                current: parseCurrentWeather(data),
                daily: parseDailyWeather(data),
                hourly: parseHourlyWeather(data),
                // parseArrowWeather is new and gives data to parseArrowWeather
                arrow: parseArrowWeather(data),
                // arrowHour: parseArrowHourWeather(data),
            }
        })
}

// parseArrowWeather function is new

// function parseArrowWeather({ hourly }) {
//     const {
//         winddirection_10m: [arrowDirection],
//     } = hourly
//     // console.log(arrowDirection)

//     function arrowRotate(selector) {
//         var elems = document.querySelectorAll(selector);
//         if (elems.length == 0) return;
//         elems.forEach(function (el) {
//             // arrowDirection + 180 is omdat image op de kop is
//             el.style.transform = "rotate(" + (arrowDirection + 180) + "deg)"
//         })
//     }
//     arrowRotate('.green-arrow-current')
//     return {
//         arrowDirection: Math.round(arrowDirection),
//     }
// }


// function parseArrowHourWeather({ hourly }) {
//     const {
//         winddirection_10m: [arrowDirection],
//     } = hourly
//     // console.log(arrowDirectionHour)

//     function arrowRotate(selector) {
//         var elems = document.querySelectorAll(selector);
//         if (elems.length == 0) return;
//         elems.forEach(function (el) {
//             // arrowDirection + 180 is omdat image op de kop is
//             el.style.transform = "rotate(" + (arrowDirection + 180) + "deg)"
//         })
//     }
//     arrowRotate('.green-arrow-current')
//     return {
//         arrowDirection: Math.round(arrowDirection),
//     }
// }







// test, alleen element toe gevoegt aan function
// alles in de functie veranderd naar windDirection ipv arrowDirection


function arrowRotate(elems, windDirection) {
    if (elems.length == 0) return;
    elems.forEach(function (el) {
        // windDirection + 180 is omdat image op de kop is
        // -51 toegevoegt op basis van windDirection console log = 206. huidige wind direction zegt gewoon 155. (206-155 = 51)
        el.style.transform = "rotate(" + (windDirection + 180) + "deg)"
        // console.log(windDirection)
    })
}

function parseArrowWeather({ hourly }) {
    const {
        winddirection_10m: [windDirection],
    } = hourly
    // console.log(windDirection)

    arrowRotate(document.querySelectorAll('.green-arrow-current'), windDirection)
    // console.log(windDirection)
    return {
        windDirection: Math.round(windDirection),
    }
}
//





function parseCurrentWeather({ current_weather, daily }) {
    // pull from data
    // check if windDirection is the right unit maby  winddirection_10m
    const {
        temperature: currentTemp,
        // current wind is geplaatst door tutorial, maar ik heb hem devined inde daily const
        // windDirection: currentWind,
        //change it back to windDirection because daily and hour are not current
        weathercode: iconCode,
    } = current_weather

    const {
        //destructure the array so that it only takes the [0] of the data (data is an ungoing array)
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        precipitation_sum: [precip],
        // didnt use wind so put my own value but there is already a windDirection in this function
        // windDirection: [windDirectionDaily],
        // windDirection_10m ?
        winddirection_10m_dominant: [windDirection],
    } = daily
    // console.log(windDirection)

    return {
        // things that we get from the API
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        //changed windDirection to windDirection: windDirection_10m,
        // first name = what is logged in console. after : is data that is lined to that name?
        //
        // dominantWindDirection: Math.round(winddirection_10m_dominant),
        windDirection: Math.round(windDirection),
        // rounding off precip specific to the nearest 100
        precip: Math.round(precip * 100) / 100,
        iconCode,

    }
}

function parseDailyWeather({ daily }) {
    // want to loop trough this object
    // want to get the time value. wich is an array so we map over the array
    return daily.time.map((time, index) => {
        //return ojbect with the data we need
        return {
            // this API is in seconds, so * 1000 = converting it to miliseconds
            timestamp: time * 1000,
            // index of the weather value at the current index, day one = 1 ,day two = 2 etc.
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index]),
            windDirection: daily.winddirection_10m_dominant[index]

        }
    })
}
// also need current_weather because we need to know what time to start it in the app
// example if i check the app at 14:00 or 19:00
function parseHourlyWeather({ hourly, current_weather }) {
    return hourly.time
        .map((time, index) => {
            // console.log(hourly.winddirection_10m[index])
            return {
                timestamp: time * 1000,
                iconCode: hourly.weathercode[index],
                temp: Math.round(hourly.temperature_2m[index]),
                windDirection: Math.round(hourly.winddirection_10m[index]),
                precip: Math.round(hourly.precipitation[index] * 100) / 100,
            }
            // this property has a timestamp property that is being returned
            // filter for current hour if its >= than current time.
            // so that this timestamp always returns the current hour
        }).filter(({ timestamp }) => timestamp >= current_weather.time * 1000)
    // .filter(({ timestamp }) =>
    //     [9, 10, 11, 12, 13, 14].includes(new Date(timestamp).getHours()) && [4].includes(new Date(timestamp).getDay())
    // )
}
// lat = lattitude
// lon = longitude
// timezone