'use strict'

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
let strictMode = false

const stepsLabel = document.getElementById('steps-label')

const randomSignal = function(signals) {
    const randomIndex = Math.floor(Math.random() * Object.keys(signals).length)
    // console.log(randomIndex)
    return signals[Object.keys(signals)[randomIndex]]
}

const addSigToSeq = function(newSignal) {
    sequence.push(newSignal)
    console.log('Steps: ', sequence.length)
    stepsLabel.innerText = sequence.length === 1
        ? sequence.length + " STEP" : sequence.length + " STEPS"
    fadeIn(stepsLabel, 2.0)
    setTimeout(() => fadeOut(stepsLabel, 2.4, false), 2000)
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
    const playNext = function() {
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

const toggleMode = function(event) {
    strictMode = event.target.checked
    console.log(event.target.label)
    const labelEl = document.querySelector('#strict-mode+label')
    labelEl.innerText = event.target.checked
        ? "Disable strict mode" : "Enable strict mode"
}

const clickSignal = function(signal) {
    if (compareSequence(userSeq.concat(signal), sequence)) {
        playSound(signal)
        animateSignal(signal, 'active', 600, 200)
        userSeq.push(signal)
        if (userSeq.length === sequence.length) {
            console.log('Correct!')
            setTimeout(() => {
                addSigToSeq(randomSignal(signals))
                playSequence(sequence)
            }, 1000)
        }
    } else {
        console.log('Wrong!')
        if (!strictMode) {
        // Have to make sure the player can't click another signal at this point
            playingSeq = true
            animateSignal(signal, 'wrong', 500, 100)
                .then(() => playSequence(sequence))
        } else {
            console.log('booom')
            isPlaying = false
            const animatePromise = signals.map(sig =>
                animateSignal(sig, 'wrong', 1200, 100))
            Promise.all(animatePromise).then(() => fadeIn(intro, 1))
        }
    }
}

const startGame = function() {
    fadeOut(document.getElementById('intro'), 0.6)
        .then(() => new Promise(resolve => {
            setTimeout(() => resolve(), 600)
        }))
        .then(() => {
            sequence = []
            userSeq = []
            addSigToSeq(randomSignal(signals))
            playSequence(sequence)
            isPlaying = true
        })
}

const fadeOut = function(element, duration, dispNone = true) {
    const transitionEndPromise = new Promise((resolve) => {
        element.addEventListener('transitionend', function transitionCb(event) {
            element.removeEventListener('transitionend', transitionCb)
            resolve()
        })
        element.style.transition = `opacity ${duration}s`
        element.offsetHeight
        element.classList.add('hide')
    })
    return transitionEndPromise.then(() => {
        element.style.transition = ''
        if (dispNone) element.classList.add('none')
    })
}

const fadeIn = function(element, duration) {
    element.classList.add('hide')
    element.classList.remove('none')
    element.style.transition = `opacity ${duration}s`
    element.offsetHeight
    element.classList.remove('hide')
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

    document.getElementById('strict-mode').addEventListener('click', toggleMode)
    document.getElementById('start-btn').addEventListener('click', startGame)
}

initGame()
