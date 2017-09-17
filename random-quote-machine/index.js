jsonURL = "https://api.forismatic.com/api/1.0/"
jsonURL += "?method=getQuote&lang=en&format=jsonp&jsonp=?"

const getQuote = url => {
    $.getJSON(url, json => {
        updateQuote(json.quoteText, json.quoteAuthor)
        updateTweetBtn(json.quoteText, json.quoteAuthor)
    })
}

const updateQuote = (quote, author) => {
    $('#quote p').html(quote)
    $('#quote .blockquote-footer').html(author)
}

const updateTweetBtn = (quote, author) => {
    href = "https://twitter.com/intent/tweet"
    href += "?text=Random-Quote-Machine: " + quote + " - " + author
    $('#tweet-out').prop("href", href)
}

const randomColor = () => {
    bgColor = []
    for (let i = 0; i < 3; i++) {
        bgColor[i] = Math.round(Math.random() * 255)
    }

    // console.log("bgColor:", bgColor, "total:", bgColor.reduce((acc, x) => acc + x))
    
    if (bgColor.reduce((acc, x) => acc + x) > 255 * 3 / 2) {
        textColor = [20, 20, 20]
        footerColor = [70, 70, 70]
    } else {
        textColor = [245, 245, 245]
        footerColor = [200, 200, 200]
    }

    rgbBgStr = "rgb(" + bgColor[0] + ", " + bgColor[1] + ", " + bgColor[2] + ")"
    rgbTextStr = "rgb(" + textColor[0] + ", " + textColor[1] + ", " + textColor[2] + ")"
    rgbFooterStr = "rgb(" + footerColor[0] + ", " + footerColor[1] + ", " + footerColor[2] + ")"
    
    $('div.jumbotron').css("background-color", rgbBgStr)
    $('.blockquote p').css("color", rgbTextStr)
    $('.blockquote-footer').css("color", rgbFooterStr)
}

$(document).ready(() => {
    quote = getQuote(jsonURL)
    console.log(quote)
    randomColor()
    $('#get-quote').on('click', () => {
        getQuote(jsonURL)
        randomColor()
    })
})
