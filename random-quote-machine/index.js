jsonURL = "http://api.forismatic.com/api/1.0/"
jsonURL += "?method=getQuote&lang=en&format=jsonp&jsonp=?"

const getQuote = url => {
    $.getJSON(url, json => {
        $('#quote p').html(json.quoteText)
        $('#quote .blockquote-footer').html(json.quoteAuthor)
    })
}

const randomColor = () => {
    rColor = []
    for (let i = 0; i < 3; i++) {
        rColor[i] = Math.round(Math.random() * 255)
    }
    rgbStr = "rgb(" + rColor[0] + ", " + rColor[1] + ", " + rColor[2] + ")"
    $('div.jumbotron').css("background-color", rgbStr)
}

$(document).ready(() => {
    getQuote(jsonURL)
    randomColor()
    $('#get-quote').on('click', () => {
        getQuote(jsonURL)
        randomColor()
    })
})