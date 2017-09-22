"use strict"

const endpoint = "https://en.wikipedia.org/w/api.php"
const queryUrl = `${endpoint}?action=query&titles=Mozart&prop=info&inprop=url&format=json&origin=*`

const initiateSearch = keyword => {
    keyword = typeof keyword === 'string' ? keyword : $('#input-search').val()

    $.ajax({
        url: endpoint,
        data: {
            origin: "*",
            action: "query",
            format: "json",
            origin: "*",
            prop: "info",
            inprop: "url",
            titles: keyword
        },
        success: showResults
    })
}

const showResults = json => {
    console.log(json.query.pages)

    const keys = Object.keys(json.query.pages)
    const allResults = keys.map((key, i) => json.query.pages[key])
    // console.log(allResults)

    const resultsHtml = allResults.map(entry => 
        `<li><a href="${entry.fullurl}">${entry.title}</a></li>`)

    $('#search-results').html(resultsHtml.join(''))
}

$('document').ready(() => {
    // $.getJSON(queryUrl, json => {
    //     console.log('hi', json)
    // })

    initiateSearch('andromeda')
    // $.ajax({
    //     url: endpoint,
    //     data: {
    //         origin: "*",
    //         action: "query",
    //         format: "json",
    //         origin: "*",
    //         prop: "info",
    //         inprop: "url",
    //         titles: "Mozart"
    //     },
    //     success: showResults
    // })

    $('#btn-search').on('click', initiateSearch)
    $('#input-search').on('keydown', e => {
        if (e.keyCode == 13) {
            initiateSearch()
            e.preventDefault()
        } 
      });
});
