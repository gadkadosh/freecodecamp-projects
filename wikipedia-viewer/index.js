"use strict"

const endpoint = "https://en.wikipedia.org/w/api.php"

const showSearchForm = () => {
    $('#search-here, #random-article').fadeOut(300, () =>
        $('#search-form').fadeIn(400, () => $('#input-search').focus())
    )
}

const initiateSearch = (keyword, limit = 10, callback) => {
    $('#btn-search i').removeClass('fa-search').addClass('fa-spinner fa-pulse')
    $('#btn-more i').addClass('fa-spinner fa-pulse')

    $.ajax({
        url: endpoint,
        data: {
            origin: "*",
            action: "opensearch",
            format: "json",
            search: keyword,
            limit: limit
        },
        success: json => {
            $('#btn-search i').removeClass('fa-spinner fa-pulse').addClass('fa-search')
            $('#btn-more i').removeClass('fa-spinner fa-pulse')
            callback(json)
        }
    })
}

const showResults = json => {
    // console.log(json)

    const allResults = json[1].map(x => ({ title: x }))
        .map((x, i) => Object.assign(x, { description: json[2][i] }))
        .map((x, i) => Object.assign(x, { url: json[3][i] }))
    
    // console.log(allResults)
        
    const resultsHtml = allResults.length !== 0 ?
        allResults.map(entry => 
            `<li class="my-4">
                <a href="${entry.url}">
                    <p class="font-weight-bold mb-0">${entry.title}</p>
                    <p class="font-smaller">${entry.description ? entry.description.slice(0, 140) + '...' : ''}</p>
                </a></li>`) :
        `<p class="text-center mt-3">No results found!</p><p class="text-center">Please try again</p>`
    
    $('#search-window').fadeIn(400)
    if (Array.isArray(resultsHtml)) {
        $('#search-results').html(resultsHtml.join(''))
    } else {
        $('#search-results').html(resultsHtml)
    }

    if (!Array.isArray(resultsHtml) || resultsHtml.length < 10 || resultsHtml.length > 49) {
        $('#btn-more').fadeOut(200)
    } else {
        $('#btn-more').fadeIn(200)
    }
}

const resetState = () => {
    $('#search-form').fadeOut(200, () => 
        $('#search-window').fadeOut(200, () => 
            $('#search-here, #random-article').fadeIn(500)))
    $('#input-search').val('')
}

const showMore = () => {
    const currentLimit = $('#search-results li').length + 10
    initiateSearch($('#input-search').val(), currentLimit, showResults)
}

const inputChange = e => {
    if (e.keyCode === 13 || e.keyCode === 27) return
    const input = $('#input-search').val()
    // console.log(input)
    if (input.length > 2) {
        initiateSearch(input, 6, showSuggestions)
    } else {
        $('#list-suggestions').hide()
    }
}

const showSuggestions = json => {
    // console.log(json)
    if (json[1].length < 1) return;
    const suggestions = json[1].map(x => 
        `<li class="dropdown-item cursor-default">${x}</li>`)
    $('#list-suggestions').show().html(suggestions)
    $('.dropdown-item').on('click', e => {
        $('#input-search').val($(e.currentTarget).html()).focus()
        $('#list-suggestions').hide()
        initiateSearch($('#input-search').val(), 10, showResults)
    })
}

const colorfulElement = (element, text) => {
    const colorHtml = text.split('').map(c => {
        const color = ['r', 'g', 'b'].map(x => Math.round(Math.random() * 255))
        return `<span style="color: rgb(${color.join(',')})">${c}</span>`
    })
    element.html(colorHtml)
}
    
$('document').ready(() => {
    $('#search-form').hide()
    $('#search-window').hide()
    $('#list-suggestions').hide()

    colorfulElement($('h1'), $('h1').html())
    colorfulElement($('footer p'), $('footer p').html())

    $('#search-here').on('click', showSearchForm)
    $('#btn-search').on('click', e => initiateSearch($('#input-search').val(), 10, showResults))
    $('#btn-reset').on('click', resetState)
    $('#btn-more').on('click', showMore)
    $('#input-search').on('keyup', inputChange)
    $('#input-search').on('keydown', e => {
        if (e.keyCode === 13) {
            initiateSearch($('#input-search').val(), 10, showResults)
            e.preventDefault()
        } else if (e.keyCode === 27) {
            $('#list-suggestions').hide()
        }
    });
});
