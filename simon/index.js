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
let userSeq = []
let playingSeq = false

function randomSignal(signals) {
    const randomIndex = Math.floor(Math.random() * Object.keys(signals).length)
    // console.log(randomIndex)
    return signals[Object.keys(signals)[randomIndex]]
}

function addSigToSeq(newSignal) {
    // const newSignal = randomSignal
    // console.log('clicked on:', newSignal)
    sequence.push(newSignal)
}

function animateSignal(signal) {
    return new Promise((resolve, reject) => {
        const element = signal.element.querySelector('div')
        // console.log(element)
        element.classList.add('active')
        setTimeout(() => {
            element.classList.remove('active')
            resolve()
        }, 1500)
    })
}

function playSound(signal) {
    const audioPromise = signal.sound.play()
    audioPromise.catch((error) => {
        console.log(error)
    })
}

function playSequence(sequence) {
    // TODO: clicking on a tile should interrupt playing the sequence
    userSeq = []
    playingSeq = true
    let sigIndex = 0
    function playNext() {
        if (sigIndex >= sequence.length) {
            playingSeq = false
            return
        }
        const signal = sequence[sigIndex]
        animateSignal(signal).then(() => {
            sigIndex++
            playNext()
        })
        playSound(signal)
    }
    playNext()
}

function compareSequence(userSeq, sequence) {
    // This works because both userSeq and sequence point to the objects in 'signals'
    return userSeq.every((sig, i) => sig === sequence[i])
}

function clickSignal(signal) {
    // console.log(signal)
    animateSignal(signal)
    playSound(signal)
    if (compareSequence(userSeq.concat(signal), sequence)) {
        userSeq.push(signal)
        if (userSeq.length === sequence.length) {
            console.log('Correct!')
            addSigToSeq(randomSignal(signals))
            playSequence(sequence)
        }
    } else {
        console.log('Wrong!')
        playSequence(sequence)
    }
}

Object.keys(signals).forEach(sig => {
    signals[sig].element = document.getElementById(signals[sig].id)
    signals[sig].element.addEventListener('click', function(e) {
        // TODO: clicking on a tile should interrupt playing the sequence
        if (playingSeq) return
        clickSignal(signals[sig])
    })
})

function startGame() {
    // Initialize sounds
    signals.signal_1.sound = new Audio('./simonSound1.mp3')
    signals.signal_2.sound = new Audio('./simonSound2.mp3')
    signals.signal_3.sound = new Audio('./simonSound3.mp3')
    signals.signal_4.sound = new Audio('./simonSound4.mp3')

    addSigToSeq(randomSignal(signals))
    playSequence(sequence)
}

startGame()
