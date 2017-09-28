'use static'

const urlEndpoint = 'https://wind-bow.glitch.me/twitch-api/'
const channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]

const fillItemChannel = entry => {
    let item
    if (entry.stream === null) {
        item = 
        `<li class="row border border-top-0">
            <div class="col">${name}</div>
            <div class="col">Channel offline</div>
            <div class="col"></div>
        </li>`
    } else {
        item = 
        `<li class="row border border-top-0">
            <div class="col">
                <img src="${entry.stream.channel.logo}" width="64px">${entry.stream.channel.display_name}</div>
            <div class="col">
                <a href="${entry.stream.channel.url}">
                    Channel live, ${entry.stream.viewers} viewers</a>
                    </div>
            <div class="col">${entry.stream.channel.status}</div>
        </li>`
    }
    return item
}

const fillItemUser = entry => {
    // console.log(entry)
    const name = entry.display_name
    const logo = entry.logo ? entry.logo : ''
    const bio = entry.bio ?
        entry.bio.split(' ').slice(0, 7).join(' ') + '...' :
        'Status unavailable'

    return (
        `<li class="row border border-top-0">
            <div class="col">
                <img src="${logo}" alt="${name}" width="64px">
                ${name}</div>
            <div class="col">Status<br>${bio}</div>
            <div class="col"></div>
        </li>`
    )
}

const updateList = (listElem, data) => {
    console.log(data)
    const list = data.map(fillItemUser)
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
        console.log(usersData.map((x, i) => Object.assign(x, streamsData[i], channelsData[i])))
        
        // updateList($('#channels-list'), allData)
    })

    
})
