url = "https://query.yahooapis.com/v1/public/yql"
query = "select * from weather.forecast where woeid = 615702"
queryUrl = "?q=" + query.replace(/ /g, '%20').replace(/=/g, '%3D') + "&format=json"
weatherUrl = url + queryUrl

// console.log(weatherUrl)
// console.log(url + "?q=select%20*%20from%20weather.forecast%20where%20woeid%20%3D%202487889&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")

$('document').ready(() => {
    // navigator.geolocation.getCurrentPosition(pos => {
    //     console.log("Lon:", pos.coords.longitude, "Lat", pos.coords.latitude)
    // })

    $.getJSON(weatherUrl, json => {
        console.log('hi')
        console.log(json.query.results.channel)
        // console.log(JSON.stringify(json))

        city = json.query.results.channel.location.city
        country = json.query.results.channel.location.country
        summary = json.query.results.channel.item.condition.text
        temperature = json.query.results.channel.item.condition.temp
        tempUnits = json.query.results.channel.units.temperature

        $('#location').html(`The weather in ${city}, ${country} is`)
        $('#weather-summary').html(summary)
        $('#temperature').html(temperature + tempUnits)
    })
})
