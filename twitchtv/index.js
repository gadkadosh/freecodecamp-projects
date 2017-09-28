'use static'

const urlEndpoint = 'https://wind-bow.glitch.me/twitch-api/'
const channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]

const updateChannel = (name, data) => {
    console.log(data)
    // const item = data.stream === null ?
    //     `<li>Channel offline</li>` :
    //     `<li>${data.stream._id}</li>`

    let item = ''
    if (data.stream === null) {
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
                <img src="${data.stream.channel.logo}" width="64px">${data.stream.channel.display_name}</div>
            <div class="col">
                <a href="${data.stream.channel.url}">
                    Channel live, ${data.stream.viewers} viewers</a>
                    </div>
            <div class="col">${data.stream.channel.status}</div>
        </li>`
    }
    
    // console.log(item)
    $('#channels-list').append(item)
}

$(document).ready(() => {
    channels.map(channel => urlEndpoint + 'streams/' + channel)
    .forEach((url, i) =>
        $.getJSON(url).then(data => updateChannel(channels[i], data)))
})
