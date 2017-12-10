'use strict'

const signals = {
    signal_1: {
        id: 'signal-1',
        sound: '',
    },
    signal_2: {
        id: 'signal-2',
        sound: '',
    },
    signal_3: {
        id: 'signal-3',
        sound: '',
    },
    signal_4: {
        id: 'signal-4',
        sound: '',
    },
}

const sequence = []
let playingSeq = false

function randomSignal(signals) {
    const randomSignal = Math.floor(Math.random() * Object.keys(signals).length)
    console.log(randomSignal)
    return signals[Object.keys(signals)[randomSignal]]
}

function addSigToSeq(newSignal) {
    // const newSignal = randomSignal
    // console.log('clicked on:', newSignal)
    sequence.push(newSignal)
}

function animateSignal(signal) {
    const element = signal.element.querySelector('div')
    console.log(element)
    element.classList.add('active')
    const animPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            element.classList.remove('active')
            resolve()
        }, 1500)
    })
    return animPromise
}

function playSound(signal) {
    signal.sound.play()
}

function playSequence(sequence) {
    playingSeq = true
    let sigIndex = 0
    function playNext() {
        if (sigIndex >= sequence.length) return
        const signal = sequence[sigIndex]
        animateSignal(signal).then(() => {
            sigIndex++
            playNext()
        })
        playSound(signal)
    }
    playNext()
    playingSeq = false
}

function clickSignal(signal) {
    console.log(signal)
    animateSignal(signal)
    playSound(signal)
    // add to userSeq
    // compareSequence
}

Object.keys(signals).forEach(sig => {
    signals[sig].element = document.getElementById(signals[sig].id)
    signals[sig].element.addEventListener('click', function(e) {
        if (playingSeq) return
        clickSignal(signals[sig])
    })
})

function startGame() {
    signals.signal_1.sound = new Audio('./simonSound1.mp3')
    signals.signal_2.sound = new Audio('./simonSound2.mp3')
    signals.signal_3.sound = new Audio('./simonSound3.mp3')
    signals.signal_4.sound = new Audio('./simonSound4.mp3')
    addSigToSeq(randomSignal(signals))
    addSigToSeq(randomSignal(signals))
    addSigToSeq(randomSignal(signals))
    addSigToSeq(randomSignal(signals))
    addSigToSeq(randomSignal(signals))
    addSigToSeq(randomSignal(signals))
    console.log(sequence)
}

startGame()
