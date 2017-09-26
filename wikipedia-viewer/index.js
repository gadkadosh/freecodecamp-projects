"use strict"

const endpoint = "https://en.wikipedia.org/w/api.php"

const showSearchForm = () => {
    $('#search-here, #random-article').fadeOut(300, () => {
        $('#search-form').fadeIn(400)
    })
}

const initiateSearch = (keyword, limit = 10) => {
    $.ajax({
        url: endpoint,
        data: {
            origin: "*",
            action: "opensearch",
            format: "json",
            search: keyword,
            limit: limit
        },
        success: showResults
    })
}

const showResults = json => {
    console.log(json)

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
        `<p class="text-center mt-3">No results found! Please try again</p>`
    
    // console.log(resultsHtml)

    $('#search-window').fadeIn(400)
    if (Array.isArray(resultsHtml)) {
        $('#search-results').html(resultsHtml.join(''))
    } else {
        $('#search-results').html(resultsHtml)
        $('#btn-more').hide()
    }
}

const resetState = () => {
    $('#search-form').fadeOut(200, () => 
        $('#search-window').fadeOut(200, () => 
            $('#btn-random-article').fadeOut(200, () => $('#search-here, #random-article').fadeIn(500))))
    $('#input-search').val('')
}

const showMore = () => {
    const currentLimit = $('#search-results li').length + 10
    initiateSearch($('#input-search').val(), currentLimit)
}
    
$('document').ready(() => {
    $('#search-form').hide()
    $('#search-window').hide()
    $('#btn-random-article').hide()

    $('#search-here').on('click', showSearchForm)
    $('#btn-search').on('click', e => initiateSearch($('#input-search').val()))
    $('#btn-reset').on('click', resetState)
    $('#btn-more').on('click', showMore)

    $('#input-search').on('keydown', e => {
        if (e.keyCode == 13) {
            initiateSearch($('#input-search').val())
            e.preventDefault()
        } 
      });

    //   initiateSearch('Mozart')
});
