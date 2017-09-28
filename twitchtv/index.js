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
    return `<li class="row border border-top-0">
            <div class="col">
                <img src="${entry.logo}" alt="${entry.display_name}" width="64px">
                ${entry.display_name}</div>
            <div class="col">Status</div>
            <div class="col"></div>
        </li>`
}

const updateList = (listElem, data) => {
    console.log(data)
    console.log(fillItemUser(data[0]))
    const list = data.map(fillItemUser)
    // console.log(list)
    listElem.append(list)
}

$(document).ready(() => {
    $('#search-bar').on('keydown', e => e.preventDefault())

    // const streamUrls = channels.map(channel => urlEndpoint + 'streams/' + channel)
    const streamUrls = channels.map(channel => urlEndpoint + 'users/' + channel)
    const allData = []
    const requests = streamUrls.map(url => $.getJSON(url)
        .then(data => allData.push(data)))

    $.when.apply($, requests).then(() => {
        updateList($('#channels-list'), allData)
    })
})
