'use strict'

// state can be 'stop', 'work', 'pause', 'extended'
const state = []
let counter
let workLength = 25
let pauseLength = 5
let extendedEvery = 4
let skip = false

// Dom elements
const bodyElem = document.getElementsByTagName('body')[0]
const goBtnElem = document.getElementById('btn-go-stop')
const stopLblElem = document.getElementById('stop-label')
const analogTimerElem = document.getElementById('timer-analog')
const counterElem = document.getElementById('counter')
const workLengthElem = document.getElementById('work-length')
const pauseLengthElem = document.getElementById('pause-length')
const extendedEveryElem = document.getElementById('extended-every')
const workRangeElem = document.getElementById('range-work')
const pauseRangeElem = document.getElementById('range-pause')
const extendedRangeElem = document.getElementById('range-extended')
const skipBtnElem = document.getElementById('btn-skip')

function updateCounter(nextBuzz, sessionLength, counterElem) {
    const timeLeft = Math.round((nextBuzz - Date.now()) / 1000)
    if (timeLeft > 0 && !skip) {
        // console.log('timer at:', timeLeft)
        counterElem.innerText = formatTime(timeLeft)
        updateAnalogTimer(timeLeft * 1000 / sessionLength, analogTimerElem, goBtnElem)
    } else {
        skip = false
        window.clearInterval(counter)
        const curState = state[state.length - 1]
        let newNextBuzz
        let soundPromise
        if (shouldExtended(state)) {
            state.push('extended')
            setBg(state[state.length - 1], bodyElem)
            sessionLength = workLength * 60 * 1000
            soundPromise = chimeSound.play()
        } else if (curState === 'work'){
            state.push('pause')
            setBg(state[state.length - 1], bodyElem)
            sessionLength = pauseLength * 60 * 1000
            soundPromise = chimeSound.play()
        } else if (curState === 'pause' || curState === 'extended') {
            state.push('work')
            setBg(state[state.length - 1], bodyElem)
            sessionLength = workLength * 60 * 1000
            soundPromise = gongSound.play()
        }
        if (soundPromise !== undefined) {
            soundPromise.catch(error => {
                // Safari 11 for example blocks autoplaying video/audio
                console.log('Sound probably blocked on this platform')
            })
        }
        newNextBuzz = Date.now() + sessionLength
        updateBtn(state, goBtnElem)
        updateCounter(newNextBuzz, sessionLength, counterElem)
        counter = window.setInterval(function(){
            updateCounter(newNextBuzz, sessionLength, counterElem)
        }, 1000)
    }
}

function updateAnalogTimer(percentThrough, analogTimerElem, goBtnElem) {
    // console.log(percentThrough)
    const newScale = (percentThrough * maxScale) + (1 - maxScale)
    // console.log(newScale)
    const transformDiv = "scale(" + newScale + ")"
    analogTimerElem.style.transform = transformDiv
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
    const curState = state[state.length - 1]
    if (curState === 'stop') {
        goBtnElem.innerText = 'Go!'
    } else if (curState === 'extended') {
        goBtnElem.innerText = 'Extended Pause'
    } else {
        const title = curState.slice(0, 1).toUpperCase() + curState.slice(1)
        goBtnElem.innerText = title
    }
}

function setBg(newState, bodyElem) {
    const stateBgs = {
        'stop': 'bg-stop',
        'work': 'bg-work',
        'pause': 'bg-pause',
        'extended': 'bg-extended',
    }
    if (stateBgs[newState]) {
        bodyElem.classList.add(stateBgs[newState])
        Object.keys(stateBgs).filter(x => x !== newState)
            .forEach(x => bodyElem.classList.remove(stateBgs[x]))
    }
}

function startWork() {
    const sessionLength = workLength * 60 * 1000
    const nextBuzz = Date.now() + sessionLength
    updateCounter(nextBuzz, sessionLength, counterElem)
    counter = window.setInterval(function(){
        updateCounter(nextBuzz, sessionLength, counterElem)
    }, 1000)
    state.push('work')
    setBg(state[state.length - 1], bodyElem)
}

function setLabel(labelElem, content, unit) {
    labelElem.innerText = content === 1 ?
        content + ' ' + unit : content + ' ' + unit + 's'
}

document.getElementById('btn-go-stop').addEventListener('mouseover', function(event) {
    if (state[state.length - 1] !== 'stop') {
        stopLblElem.classList.remove('hidden')
    }
})

document.getElementById('btn-go-stop').addEventListener('mouseleave', function(event) {
    stopLblElem.classList.add('hidden')
})

document.getElementById('btn-go-stop').addEventListener('click', function(event) {
    if (state[state.length - 1]  === 'stop') {
        startWork()
        skipBtnElem.classList.remove('hidden')
    } else {
        window.clearInterval(counter)
        state.push('stop')
        setBg(state[state.length - 1], bodyElem)
        skipBtnElem.classList.add('hidden')
    }
    updateBtn(state, goBtnElem)
})

document.getElementById('btn-skip').addEventListener('click', function(event) {
    goBtnElem.innerText = "Skipping"
    skip = true
})

workRangeElem.addEventListener('input', function(event) {
    workLength = Number(event.currentTarget.value)
    setLabel(workLengthElem, workLength, 'Minute')
})

pauseRangeElem.addEventListener('input', function(event) {
    pauseLength = Number(event.currentTarget.value)
    setLabel(pauseLengthElem, pauseLength, 'Minute')
})

extendedRangeElem.addEventListener('input', function(event) {
    extendedEvery = Number(event.currentTarget.value)
    setLabel(extendedEveryElem, extendedEvery, 'Session')
})

// Start
setLabel(workLengthElem, workLength, 'Minute')
workRangeElem.value = workLength
setLabel(pauseLengthElem, pauseLength, 'Minute')
pauseRangeElem.value = pauseLength
setLabel(extendedEveryElem, extendedEvery, 'Session')
extendedRangeElem.value = extendedEvery
state.push('stop')
setBg(state[state.length - 1], bodyElem)
updateBtn(state, goBtnElem)
counterElem.innerText = formatTime(workLength * 60)
const chimeSound = new Audio('./zymbel.mp3')
const gongSound = new Audio('./chinese-gong.mp3')
const maxScale = (100 - window.getComputedStyle(goBtnElem).transform
    .match(/matrix\((\d+\.\d+),.*\)/)[1] * 100) / 100

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
