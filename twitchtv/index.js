'use static'

const urlEndpoint = 'https://wind-bow.glitch.me/twitch-api/'
// const channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]
const channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas"]

const fillItem = entry => {
    // console.log(entry)
    const name = entry.name
    const logo = entry.logo ? entry.logo : ''
    const bio = entry.bio ?
        entry.bio.split(' ').slice(0, 12).join(' ') + '...' :
        ''
    const status = entry.live ? 
        `Channel live, ${entry.stream.viewers} viewers` :
        'Channel offline'
    const followers = entry.followers

    return (
        `<li class="row border-bottom py-3 hover-bg-light">
            <div class="col-12 col-sm-4  my-3 text-center text-larger"><a href="${entry.url}">
                <img src="${logo}" alt="${name}" width="64px" class="mx-auto mb-3 d-block">
                ${name}</a></div>
            <div class="col-12 col-sm-8 my-3 text-center text-sm-left"><p class="font-weight-bold">${status}</p>
                <p>${bio}</p></div>
        </li>`
    )
}

const updateList = (listElem, data) => {
    console.log(data)
    const list = data.map(fillItem)
    listElem.append(list)
}

$(document).ready(() => {
    $('#search-bar').on('keydown', e => e.preventDefault())

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
        const allData = usersData.map((x, i) => Object.assign(x, streamsData[i], channelsData[i]))
        updateList($('#channels-list'), allData)
    })

    
})
