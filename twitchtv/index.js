'use static'

const urlEndpoint = 'https://wind-bow.glitch.me/twitch-api/'
// const channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]
// const channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas"]
const channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas", "lirik", "ddahyoni", "stryfo"]

const fillItem = entry => {
    // console.log(entry)
    const name = entry.name
    const logo = entry.logo ? entry.logo : ''
    const bio = entry.bio ?
        entry.bio.split(' ').slice(0, 17).join(' ') + '...' :
        ''
    const followers = entry.followers
    const status = entry.live ?
        `<a class="font-weight-bold" href="${entry.url}" target="_blank">Channel live` :
        'Channel offline'
    const preview = entry.live ?
        `<img src="${entry.stream.preview.medium}" class="img-fluid mt-3"></a>` :
        ''
    const viewers = entry.live ?
        `<p class="mt-3">${entry.stream.viewers} viewers</p>` :
        ''

    return (
        `<li class="row border-bottom py-3 hover-bg-light">
            <div class="col-12 col-sm-3 align-self-center my-3 text-center text-larger text-break-word">
                <a href="${entry.url}" target="_blank">
                    <img src="${logo}" alt="${name}" width="64px" class="mx-auto mb-3 d-block">
                ${name}</a></div>
            <div class="col-12 col-sm-5 align-self-center my-3 text-center">
                <p class="text-break-word">${bio}</p>
                <p class="font-weight-bold">${followers} followers</p></div>
            <div class="col-12 col-sm-4 align-self-center text-center">
                ${status}
                ${preview}
                ${viewers}
            </div>
        </li>`
    )
}

const updateList = (listElem, data) => {
    // console.log(data)
    listElem.empty()
    const header =
        `<li class="hover-bg-light row border-bottom text-center font-weight-bold text-largest py-3 d-md-flex d-none">
            <div class="col-sm-3">Channel name</div>
            <div class="col-sm-9">Channel status</div>
        </li>`
    const list = data.map(fillItem)
    listElem.append(header, list)
    $('#list-options').show()
}

const filterKeywords = (keywords, allData) => {
    const filtered = allData.filter(x =>
        x.name && keywords.every(word =>
            x.name.toLowerCase().includes(word)) ||
        x.bio && keywords.every(word =>
            x.bio.toLowerCase().includes(word)) ||
        x.status && keywords.every(word =>
            x.status.toLowerCase().includes(word))
    )

    return filtered
}

const filterOption = (newMode, data) => {
    const filtered = data.filter(x => {
        if (newMode === 'All') return true
        else if (newMode === 'Live') return x.live
        else if (newMode === 'Offline') return (!x.live)
    })
    return filtered
}

let allData = []
let mode = 'All'
let keywords = []

$(document).ready(() => {
    $('#search-bar').on('keydown', e => {
        if(e.keyCode === 13) {
            e.preventDefault()
        } else if(e.keyCode === 27) {
            $('#search-bar').val('')
        }
    })

    $('#list-options').hide()

    $('#list-options .nav-link').on('click', e => {
        // if has class return
        $('#list-options .nav-link').removeClass('active')
        $(e.currentTarget).addClass('active')
        mode = $(e.currentTarget).html()

        const filtered = filterKeywords(keywords, filterOption(mode, allData))
        updateList($('#channels-list'), filtered)
    })

    const userUrl = channels.map(channel => urlEndpoint + 'users/' + channel)
    const usersData = []
    let requests = userUrl.map((url, index) => $.getJSON(url)
        .then(data => usersData[index] = {
            name: data.display_name,
            logo: data.logo,
            bio: data.bio
        }))

    const streamUrls = channels.map(channel => urlEndpoint + 'streams/' + channel)
    const streamsData = []
    requests = requests.concat(streamUrls.map((url, index) => $.getJSON(url)
        .then(data =>
            data.stream ?
                streamsData[index] = {live: true, stream: data.stream} :
                streamsData[index] = {live: false}
        )))

    const channelsData = []
    const channelUrls = channels.map(channel => urlEndpoint + 'channels/' + channel)
    requests = requests.concat(channelUrls.map((url, index) => $.getJSON(url)
        .then(data => channelsData[index] = {
            url: data.url,
            followers: data.followers,
            status: data.status
        })))


    $.when.apply($, requests).then(() => {
        allData = usersData.map((x, i) => Object.assign(x, streamsData[i], channelsData[i]))
        updateList($('#channels-list'), allData)

        $('#search-bar').on('keyup', e => {
            if (e.keyCode === 13) return
            keywords = $('#search-bar').val().toLowerCase().trim().split(' ')

            const filtered = filterKeywords(keywords, filterOption(mode, allData))
            const listElem = $('#channels-list')

            if (filtered.length === 0) {
                listElem.empty().html('<p class="text-center font-weight-bold py-4">No results!</p>')
                $('#list-options').hide()
            }
            updateList(listElem, filtered)
        })
    })
})
