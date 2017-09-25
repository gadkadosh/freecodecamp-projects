"use strict"

const endpoint = "https://en.wikipedia.org/w/api.php"
// const queryUrl = `${endpoint}?action=query&titles=Mozart&prop=info&inprop=url&format=json&origin=*`
// const queryUrl = `${endpoint}?action=opensearch&search=Mozart&prop=info&inprop=url&format=json&origin=*`

const showSearchBar = () => {
    $('#search-here').fadeOut(500, () => {
        $('')
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
    json[2].forEach((x, i) => {
        Object.assign(allResults[i], { description: x.slice(0, 140) + '...' })
    })
    json[3].forEach((x, i) => {
        Object.assign(allResults[i], { url: x })
    })

    const resultsHtml = allResults.length !== 0 
        ? allResults.map(entry => 
        `<li class="list-unstyled my-4">
            <a href="${entry.url}">
                <p class="font-weight-bold mb-0">${entry.title}</p>
                <p class="font-smaller">${entry.description}</p>
            </a></li>`)
        : `<p>No results found! Please try again</p>`

    $('#search-results').html(typeof resultsHtml === 'array'
        ? resultsHtml.join('')
        : resultsHtml)
}

$('document').ready(() => {
    $('#search-here').on('click', showSearchBar)

    $('#btn-search').on('click', initiateSearch)

    $('#input-search').on('keydown', e => {
        if (e.keyCode == 13) {
            initiateSearch()
            e.preventDefault()
        } 
      });

      initiateSearch('Mozart')
});
