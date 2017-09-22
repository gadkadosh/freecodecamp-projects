const makeQuery = (url, query) => 
    url + "?q=" + encodeURIComponent(query) + "&format=json" + "&u=c"

const weatherQuery = (latitude, longitude) =>
    `select item.condition, location, units from weather.forecast where ` +
    `woeid in (select woeid from geo.places where ` +
    `text="(${latitude},${longitude})") and u='c'`

yahooApiUrl = "https://query.yahooapis.com/v1/public/yql"

const updateWeather = json => {
    // console.log(json)
    city = json.query.results.channel.location.city
    country = json.query.results.channel.location.country
    summary = json.query.results.channel.item.condition.text
    temperature = json.query.results.channel.item.condition.temp
    tempUnits = json.query.results.channel.units.temperature === 'C' 
        ? '&#8451' : '&#8457'

    $('#location').html(`The weather in ${city}, ${country} is`)
    $('#weather-summary').html(summary)
    $('#temperature').html("Temperature: " + temperature +
        '<small class="align-top">' + tempUnits + '</small>')
}

$('document').ready(() => {
    navigator.geolocation.getCurrentPosition(pos => {
        latitude = pos.coords.latitude
        longitude = pos.coords.longitude
        url = (makeQuery(yahooApiUrl, weatherQuery(latitude, longitude)))
        $.getJSON(url, updateWeather)
    })
})
