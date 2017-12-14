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

let sequence = []
let userSeq = []
let playingSeq = false

const randomSignal = function(signals) {
    const randomIndex = Math.floor(Math.random() * Object.keys(signals).length)
    // console.log(randomIndex)
    return signals[Object.keys(signals)[randomIndex]]
}

const addSigToSeq = function(newSignal) {
    // const newSignal = randomSignal
    // console.log('clicked on:', newSignal)
    sequence.push(newSignal)
}

const animateSignal = function(signal, className, duration, gap) {
    return new Promise((resolve, reject) => {
        const element = signal.element.querySelector('div')
        // console.log(element)
        element.classList.add(className)
        element.classList.remove('signal-btn')
        setTimeout(() => {
            element.classList.remove(className)
            element.classList.add('signal-btn')
            setTimeout(() => resolve(), gap)
        }, duration)
    })
}

const playSound = function(signal) {
    const audioPromise = signal.sound.play()
    audioPromise.catch(error => console.log(error))
}

const playSequence = function(sequence) {
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
        playSound(signal)
        return animateSignal(signal, 'active', 600, 200).then(() => {
            sigIndex++
            playNext()
        })
    }
    return playNext()
}

const compareSequence = function(userSeq, sequence) {
    return userSeq.every((sig, i) => sig === sequence[i])
}

const clickSignal = function(signal) {
    // console.log(signal)
    // animateSignal(signal)
    playSound(signal)
    if (compareSequence(userSeq.concat(signal), sequence)) {
        userSeq.push(signal)
        if (userSeq.length === sequence.length) {
            console.log('Correct!')
            addSigToSeq(randomSignal(signals))
            setTimeout(() => playSequence(sequence), 800)
        }
    } else {
        console.log('Wrong!')
        animateSignal(signal, 'wrong', 500, 800).then(() => playSequence(sequence))
    }
}

const startGame = function() {
    sequence = []
    userSeq = []
    addSigToSeq(randomSignal(signals))
    playSequence(sequence)
}

const initGame = function() {
    // Initialize sounds
    signals.signal_1.sound = new Audio('./simonSound1.mp3')
    signals.signal_2.sound = new Audio('./simonSound2.mp3')
    signals.signal_3.sound = new Audio('./simonSound3.mp3')
    signals.signal_4.sound = new Audio('./simonSound4.mp3')

    Object.keys(signals).forEach(sig => {
        signals[sig].element = document.getElementById(signals[sig].id)
        signals[sig].element.addEventListener('click', function(e) {
            // TODO: clicking on a tile should interrupt playing the sequence
            if (playingSeq) return
            clickSignal(signals[sig])
        })
    })

    document.getElementById('start-btn').addEventListener('click', startGame)
}

initGame()
