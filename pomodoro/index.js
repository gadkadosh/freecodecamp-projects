'use strict'

const workLength = 82 * 60 * 1000
const breakLength = 5 * 60 * 1000
// state can be 'stop', 'work', 'break'
// TODO: make it an array of the history
let state = 'stop'
let counter

// Dom elements
const goBtnElem = document.getElementById('btn-go-stop')
const counterElem = document.getElementById('counter')

function updateCounter(nextBuzz, counterElem) {
    // console.log('nextBuzz:', nextBuzz, 'now:', Date.now())
    const timeLeft = Math.floor((nextBuzz - Date.now()) / 1000)
    // console.log('timer at:', timeLeft)
    counterElem.innerText = formatTime(timeLeft)
    // console.log(formatTime(timeLeft))
}

function updateBtn(state, goBtnElem) {
    console.log('update button!', goBtnElem)
    if (state === 'stop') {
        goBtnElem.innerText = 'Go'
    } else {
        goBtnElem.innerText = 'Stop'
    }
}

function formatTime(time) {
    // time is in seconds
    const hours = Math.floor(time / (60 * 60))
    const minutes = Math.floor(time / (60)) % 60
    const seconds = Math.floor(time % (60))
    return `${padTime(hours) > 0 ? padTime(hours) + ':' : ''}${padTime(minutes)}:${padTime(seconds)}`
}

function padTime(time) {
    return String(time).padStart(2, '0')
}

document.getElementById('btn-go-stop').addEventListener('click', function(event) {
    if (state === 'stop') {
        const startTime = Date.now()
        const nextBuzz = startTime + workLength
        console.log(nextBuzz, startTime)
        updateCounter(nextBuzz, counterElem)
        counter = window.setInterval(updateCounter, 1000, nextBuzz, counterElem)
        state = 'work'
        console.log('start time:', startTime, 'rings at:', nextBuzz)
    } else if (state === 'work') {
        window.clearInterval(counter)
        state = 'stop'
        console.log('stopping')
    }
    updateBtn(state, goBtnElem)
})


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
