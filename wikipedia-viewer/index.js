"use strict"

const endpoint = "https://en.wikipedia.org/w/api.php"

const showSearchForm = () => {
    $('#search-here, #random-article').fadeOut(300, () => {
        $('#search-form').fadeIn(400)
    })
}

const initiateSearch = keyword => {
    keyword = typeof keyword === 'string' ? keyword : $('#input-search').val()

    $.ajax({
        url: endpoint,
        data: {
            origin: "*",
            action: "opensearch",
            format: "json",
            search: keyword
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
        `<p>No results found! Please try again</p>`
    
    // console.log(resultsHtml)

    $('#search-window').fadeIn(400)
    $('#search-results').html(resultsHtml.join(''))
}

const resetState = () => {
    $('#search-form').fadeOut(200, () => 
        $('#search-window').fadeOut(200, () => 
            $('#random-article-btn').fadeOut(200, () => $('#search-here, #random-article').fadeIn(500))))
    $('#input-search').val('')
}
    
$('document').ready(() => {
    $('#search-form').hide()
    $('#search-window').hide()
    $('#random-article-btn').hide()

    $('#search-here').on('click', showSearchForm)
    $('#btn-search').on('click', initiateSearch)
    $('#btn-reset').on('click', resetState)

    $('#input-search').on('keydown', e => {
        if (e.keyCode == 13) {
            initiateSearch()
            e.preventDefault()
        } 
      });

    //   initiateSearch('Mozart')
});
