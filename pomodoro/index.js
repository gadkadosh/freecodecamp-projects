'use strict'

// const workLength = 82 * 60 * 1000
// const breakLength = 5 * 60 * 1000
// state can be 'stop', 'work', 'break'
// TODO: make it an array of the history
let state = 'stop'
let counter
let workLength
let pauseLength

// Dom elements
const goBtnElem = document.getElementById('btn-go-stop')
const counterElem = document.getElementById('counter')
const workLengthElem = document.getElementById('work-length')
const pauseLengthElem = document.getElementById('pause-length')

function updateCounter(nextBuzz, counterElem) {
    const timeLeft = Math.round((nextBuzz - Date.now()) / 1000)
    // console.log('timer at:', timeLeft)
    counterElem.innerText = formatTime(timeLeft)
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
        const nextBuzz = Date.now() + workLength
        // updateCounter(nextBuzz, counterElem)
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

// Start
workLength = workLengthElem.innerText * 60 * 1000
pauseLength = pauseLengthElem.innerText * 60 * 1000
counterElem.innerText = formatTime(workLength / 1000)

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
