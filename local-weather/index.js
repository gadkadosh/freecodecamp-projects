"use strict"

const yahooApiUrl = "https://query.yahooapis.com/v1/public/yql"
const fccApiUrl = "https://fcc-weather-api.glitch.me/"
let showCel = true

const weatherData = {}

const makeYqlQueryUrl = (url, query) => 
    url + "?q=" + encodeURIComponent(query) + "&format=json" + "&u=c"

const makeYqlQuery = (latitude, longitude) =>
    `select item.condition, location, units from weather.forecast where ` +
    `woeid in (select woeid from geo.places where ` +
    `text="(${latitude},${longitude})") and u='c'`

const makeFccQueryUrl = (url, latitude, longitude) =>
    url + `api/current?lat=${latitude}&lon=${longitude}`



const updateWeatherFromYahoo = json => {
    // console.log(json)
    weatherData.city = json.query.results.channel.location.city
    weatherData.country = json.query.results.channel.location.country
    weatherData.summary = json.query.results.channel.item.condition.text
    weatherData.temperature = json.query.results.channel.item.condition.temp

    updateHtml(weatherData.city, weatherData.country, weatherData.summary, weatherData.temperature)
}

const fahToCel = deg => Math.round(deg * 9 / 5 + 32)

const updateWeatherFromFcc = json => {
    // console.log(json)
    weatherData.city = json.name
    weatherData.country = json.sys.country
    weatherData.summary = json.weather.description
    weatherData.temperature = Math.round(json.main.temp)

    updateHtml(weatherData.city, weatherData.country, weatherData.summary, weatherData.temperature)
}

const updateHtml = (city, country, summary, temperature) => {
    const tempUnits = showCel ? '&#8451' : '&#8457'
    $('#location').html(`The weather in ${city}, ${country} is`)
    $('#summary').html(summary)
    temperature = showCel ? temperature : fahToCel(temperature)
    $('#temperature').html("Temperature: " + temperature +
        '<small class="align-top">' + tempUnits + '</small>')
}

$('document').ready(() => {
    $('#unit').hide()
    navigator.geolocation.getCurrentPosition(pos => {
        const latitude = pos.coords.latitude
        const longitude = pos.coords.longitude
        // const url = (makeYqlQueryUrl(yahooApiUrl, makeYqlQuery(latitude, longitude)))
        // $.getJSON(url, updateWeatherFromYahoo)
        const url = (makeFccQueryUrl(fccApiUrl, latitude, longitude))
        $.getJSON(url, updateWeatherFromFcc)
        $('#unit').show()
        $('#unit-cel').addClass('active')
    }, error => {
        console.log("Can't find location:", error)
        $('#location').html("Can't find location:")
        $('#summary').html(error.message)
    })

    $('.unit-select').on('click', e => {
        if (!$(e.currentTarget).hasClass('active')) {
            $('.unit-select').toggleClass('active')
            if ($(e.currentTarget).attr('id') === 'unit-cel') {
                showCel = true
            } else {
                showCel = false
            }
            console.log(showCel)
            updateHtml(weatherData.city, weatherData.country,
                weatherData.summary, weatherData.temperature)
        }
    })
})
