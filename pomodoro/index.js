'use strict'

// const workLength = 82 * 60 * 1000
// const breakLength = 5 * 60 * 1000
// state can be 'stop', 'work', 'pause'
// TODO: make it an array of the history
let state = 'stop'
let counter
let workLength = 2
let pauseLength = 1

// Dom elements
const goBtnElem = document.getElementById('btn-go-stop')
const counterElem = document.getElementById('counter')
const workLengthElem = document.getElementById('work-length')
const pauseLengthElem = document.getElementById('pause-length')

function updateCounter(nextBuzz, counterElem) {
    const timeLeft = Math.round((nextBuzz - Date.now()) / 1000)
    if (timeLeft >= 0) {
        // console.log('timer at:', timeLeft)
        counterElem.innerText = formatTime(timeLeft)
    } else {
        window.clearInterval(counter)
        if (state === 'work'){
            state = 'pause'
            const newNextBuzz = Date.now() + (pauseLength * 60 * 1000)
            counter = window.setInterval(function(){
                updateCounter(newNextBuzz, counterElem)
            }, 1000)
        } else if (state === 'pause') {
            state = 'work'
            const newNextBuzz = Date.now() + (workLength * 60 * 1000)
            counter = window.setInterval(function(){
                updateCounter(newNextBuzz, counterElem)
            }, 1000)
        }
    }
}

function formatTime(time) {
    // time is in seconds
    const hours = Math.floor(time / (60 * 60))
    const minutes = Math.floor(time / (60)) % 60
    const seconds = Math.floor(time % (60))
    return `${hours > 0 ? padTime(hours) + ':' : ''}${padTime(minutes)}:${padTime(seconds)}`
}

function padTime(time) {
    return String(time).padStart(2, '0')
}

function updateBtn(state, goBtnElem) {
    console.log('update button!', goBtnElem)
    if (state === 'stop') {
        goBtnElem.innerText = 'Go'
    } else {
        goBtnElem.innerText = 'Stop'
    }
}

document.getElementById('btn-go-stop').addEventListener('click', function(event) {
    if (state === 'stop') {
        console.log(workLength)
        const nextBuzz = Date.now() + (workLength * 60 * 1000)
        updateCounter(nextBuzz, counterElem)
        counter = window.setInterval(function(){
            updateCounter(nextBuzz, counterElem)
        }, 1000)
        state = 'work'
        // console.log('start time:', startTime, 'rings at:', nextBuzz)
    } else if (state === 'work') {
        window.clearInterval(counter)
        state = 'stop'
    }
    updateBtn(state, goBtnElem)
})

document.getElementById('btn-wl-min').addEventListener('click', function(event) {
    let currentLength = Number(workLengthElem.innerText)
    if (currentLength > 1) {
        currentLength -= 1
        workLength = currentLength
        workLengthElem.innerText = currentLength
    }
})

document.getElementById('btn-wl-plus').addEventListener('click', function(event) {
    let currentLength = Number(workLengthElem.innerText)
    currentLength += 1
    workLength = currentLength
    workLengthElem.innerText = currentLength
})

document.getElementById('btn-pl-min').addEventListener('click', function(event) {
    let currentLength = Number(pauseLengthElem.innerText)
    if (currentLength > 1) {
        currentLength -= 1
        pauseLength = currentLength
        pauseLengthElem.innerText = currentLength
    }
})

document.getElementById('btn-pl-plus').addEventListener('click', function(event) {
    let currentLength = Number(pauseLengthElem.innerText)
    currentLength += 1
    pauseLength = currentLength
    pauseLengthElem.innerText = currentLength
})

// Start
workLengthElem.innerText = workLength
pauseLengthElem.innerText = pauseLength
counterElem.innerText = formatTime(workLength * 60)

// Testing
if (padTime(0) !== '00') {
    throw new Error('Check fail: padTime function')
}
if (padTime(5) !== '05') {
    throw new Error('Check fail: padTime function')
}
if (padTime(25) !== '25') {
    throw new Error('Check fail: padTime function')
}
if (padTime(60) !== '60') {
    throw new Error('Check fail: padTime function')
}

if (formatTime(10) !== '00:10') {
    throw new Error('Check fail: formatTime function')
}
if (formatTime(25 * 60) !== '25:00') {
    throw new Error('Check fail: formatTime function')
}
if (formatTime(100) !== '01:40') {
    throw new Error('Check fail: formatTime function')
}
if (formatTime(1000) !== '16:40') {
    throw new Error('Check fail: formatTime function')
}
if (formatTime(10000) !== '02:46:40') {
    throw new Error('Check fail: formatTime function')
}
