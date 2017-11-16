'use strict'

// state can be 'stop', 'work', 'pause', 'extended'
const state = []
let counter
let workLength = 2
let pauseLength = 1

// Dom elements
const sessionTitleElem = document.getElementById('session-title')
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
        const curState = state[state.length - 1]
        let newNextBuzz
        let soundPromise
        if (shouldExtended(state)) {
            state.push('extended')
            newNextBuzz = Date.now() + (workLength * 60 * 1000)
            soundPromise = chimeSound.play()
        } else if (curState === 'work'){
            state.push('pause')
            newNextBuzz = Date.now() + (pauseLength * 60 * 1000)
            soundPromise = chimeSound.play()
        } else if (curState === 'pause' || curState === 'extended') {
            state.push('work')
            newNextBuzz = Date.now() + (workLength * 60 * 1000)
            soundPromise = gongSound.play()
        }
        if (soundPromise !== undefined) {
            soundPromise.catch(error => {
                // Safari 11 for example blocks autoplaying video/audio
                console.log('Sound probably blocked on this platform')
            })
        }
        setSessionTitle(state, sessionTitleElem)
        counter = window.setInterval(function(){
            updateCounter(newNextBuzz, counterElem)
        }, 1000)
    }
}

function shouldExtended(state) {
    return state.filter(val => val !== 'pause')
    .slice(-4)
    .every(val => val === 'work')
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
    if (state[state.length - 1] === 'stop') {
        goBtnElem.innerText = 'Go'
    } else {
        goBtnElem.innerText = 'Stop'
    }
}

function setSessionTitle(state, titleElem) {
    const curState = state[state.length - 1]
    if (curState === 'stop') {
        titleElem.innerText = ''
    } else {
        const title = curState.slice(0, 1).toUpperCase() + curState.slice(1) + '!'
        titleElem.innerText = title
    }
}

document.getElementById('btn-go-stop').addEventListener('click', function(event) {
    if (state[state.length - 1]  === 'stop') {
        console.log(workLength)
        const nextBuzz = Date.now() + (workLength * 60 * 1000)
        updateCounter(nextBuzz, counterElem)
        counter = window.setInterval(function(){
            updateCounter(nextBuzz, counterElem)
        }, 1000)
        state.push('work')
        // console.log('start time:', startTime, 'rings at:', nextBuzz)
    } else if (state[state.length - 1] === 'work') {
        window.clearInterval(counter)
        state.push('stop')
    }
    updateBtn(state, goBtnElem)
    setSessionTitle(state, sessionTitleElem)
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
state.push('stop')
setSessionTitle(state, sessionTitleElem)
counterElem.innerText = formatTime(workLength * 60)
const chimeSound = new Audio('./zymbel.mp3')
const gongSound = new Audio('./chinese-gong.mp3')

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
