'use strict'

// const signals = {
//     signal_1: {
//         id: 'signal-1',
//         // soundFile: './simonSound1.mp3',
//         soundFile: './Piano.ff.F4.mp3',
//     },
//     signal_2: {
//         id: 'signal-2',
//         // soundFile: './simonSound2.mp3',
//         soundFile: './Piano.ff.Bb4.mp3',
//     },
//     signal_3: {
//         id: 'signal-3',
//         // soundFile: './simonSound3.mp3',
//         soundFile: './Piano.ff.C5.mp3',
//     },
//     signal_4: {
//         id: 'signal-4',
//         // soundFile: './simonSound4.mp3',
//         soundFile: './Piano.ff.D5.mp3',
//     },
// }

const signals = [
    {
        id: 'signal-1',
        soundFile: './Piano.ff.F4.mp3',
    },
    {
        id: 'signal-2',
        soundFile: './Piano.ff.Bb4.mp3',
    },
    {
        id: 'signal-3',
        soundFile: './Piano.ff.C5.mp3',
    },
    {
        id: 'signal-4',
        soundFile: './Piano.ff.D5.mp3',
    },
]

let sequence = []
let userSeq = []
let playingSeq = false
let audioContext
let isPlaying = false

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
    const source = audioContext.createBufferSource()
    source.buffer = signal.soundBuffer
    source.connect(audioContext.destination)
    source.start(0)
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
    hideElem(document.getElementById('intro'))
        .then(() => {
            sequence = []
            userSeq = []
            addSigToSeq(randomSignal(signals))
            playSequence(sequence)
            isPlaying = true
        })
}

const hideElem = function(element) {
    const transitionEndPromise = new Promise((resolve) => {
        element.addEventListener('transitionend', event => {
            resolve()
        })
        element.classList.add('hide')
    })
    return transitionEndPromise.then(() => {
        element.classList.add('none')
    })
}

const initGame = function() {
    // Initialize sounds
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext
        audioContext = new AudioContext()
    } catch(error) {
        console.log("Web Audio API not supported:", error)
    }

    signals.forEach(sig => {
        const request = new XMLHttpRequest()
        request.open('GET', sig.soundFile, true)
        request.responseType = 'arraybuffer'
        request.onload = function() {
            audioContext.decodeAudioData(request.response, function(buffer) {
                sig.soundBuffer = buffer
            })
        }
        request.send()
    })

    signals.map(sig => Object.assign(sig, {
        element: document.getElementById(sig.id)
    }))

    signals.forEach(sig => {
        sig.element.addEventListener('click', function(e) {
            // TODO: clicking on a tile should interrupt playing the sequence
            if (playingSeq || !isPlaying) return
            clickSignal(sig)
        })
    })

    // Object.keys(signals).forEach(sig => {
    //     signals[sig].element = document.getElementById(signals[sig].id)
    //     signals[sig].element.addEventListener('click', function(e) {
    //         // TODO: clicking on a tile should interrupt playing the sequence
    //         if (playingSeq || !isPlaying) return
    //         clickSignal(signals[sig])
    //     })
    // })

    document.getElementById('start-btn').addEventListener('click', startGame)
}

initGame()