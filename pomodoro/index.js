'use strict'

// state can be 'stop', 'work', 'pause', 'extended'
const state = []
let counter
let workLength = 2
let pauseLength = 1
let extendedEvery = 4

// Dom elements
const timerPageElem = document.getElementById('timer-page')
const sessionTitleElem = document.getElementById('session-title')
const goBtnElem = document.getElementById('btn-go-stop')
const counterElem = document.getElementById('counter')
const workLengthElem = document.getElementById('work-length')
const pauseLengthElem = document.getElementById('pause-length')
const extendedEveryElem = document.getElementById('extended-every')

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
            setBg(state[state.length - 1], timerPageElem)
            newNextBuzz = Date.now() + (workLength * 60 * 1000)
            soundPromise = chimeSound.play()
        } else if (curState === 'work'){
            state.push('pause')
            setBg(state[state.length - 1], timerPageElem)
            newNextBuzz = Date.now() + (pauseLength * 60 * 1000)
            soundPromise = chimeSound.play()
        } else if (curState === 'pause' || curState === 'extended') {
            state.push('work')
            setBg(state[state.length - 1], timerPageElem)
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
    .slice(extendedEvery * -1)
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

function setBg(newState, timerPageElem) {
    const stateBgs = {
        'stop': 'bg-stop',
        'work': 'bg-work',
        'pause': 'bg-pause',
        'extended': 'bg-extended',
    }
    // const stateBgs = ['bg-stop', 'bg-work', 'bg-pause', 'bg-extended']
    console.log(stateBgs, newState)
    if (stateBgs[newState]) {
        const oldStates = Object.keys(stateBgs).filter(x => x !== newState)
            .forEach(x => timerPageElem.classList.remove(stateBgs[x]))
        timerPageElem.classList.add(stateBgs[newState])
    }
}

function startWork() {
    const nextBuzz = Date.now() + (workLength * 60 * 1000)
    updateCounter(nextBuzz, counterElem)
    counter = window.setInterval(function(){
        updateCounter(nextBuzz, counterElem)
    }, 1000)
    state.push('work')
    setBg(state[state.length - 1], timerPageElem)
}

document.getElementById('btn-go-stop').addEventListener('click', function(event) {
    if (state[state.length - 1]  === 'stop') {
        startWork()
    } else {
        window.clearInterval(counter)
        state.push('stop')
        setBg(state[state.length - 1], timerPageElem)
    }
    updateBtn(state, goBtnElem)
    setSessionTitle(state, sessionTitleElem)
})

document.getElementById('btn-wl-min').addEventListener('click', function(event) {
    let currentLength = Number(workLengthElem.innerText)
    if (currentLength > 1) {
        workLength = currentLength - 1
        workLengthElem.innerText = workLength
    }
})

document.getElementById('btn-wl-plus').addEventListener('click', function(event) {
    workLength = Number(workLengthElem.innerText) + 1
    workLengthElem.innerText = workLength
})

document.getElementById('btn-pl-min').addEventListener('click', function(event) {
    let currentLength = Number(pauseLengthElem.innerText)
    if (currentLength > 1) {
        pauseLength = currentLength - 1
        pauseLengthElem.innerText = pauseLength
    }
})

document.getElementById('btn-pl-plus').addEventListener('click', function(event) {
    pauseLength = Number(pauseLengthElem.innerText) + 1
    pauseLengthElem.innerText = pauseLength
})

document.getElementById('btn-ee-min').addEventListener('click', function(event) {
    let currentVal = Number(extendedEveryElem.innerText)
    if (currentVal > 1) {
        extendedEvery = currentVal - 1
        extendedEveryElem.innerText = extendedEvery
    }
})

document.getElementById('btn-ee-plus').addEventListener('click', function(event) {
    extendedEvery = Number(extendedEveryElem.innerText) + 1
    extendedEveryElem.innerText = extendedEvery
})

// Start
workLengthElem.innerText = workLength
pauseLengthElem.innerText = pauseLength
extendedEveryElem.innerText = extendedEvery
state.push('stop')
setBg(state[state.length - 1], timerPageElem)
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
