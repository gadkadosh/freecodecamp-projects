'use static'

let currentNumber = 0
let numbers = []
let operation

// const currentNumber = () => {
//     return numbers[numbers.length - 1] || 0
// }

/* Functions */
const updateDisplay = (num = currentNumber) => {
    strNumber = String(num)
    if(strNumber.includes('.')) {
        display.innerText = String(strNumber)
        return
    }
    display.innerText = String(strNumber)
    // displayElement.innerText = String(strNumber) + '.'
}

const resetCalc = () => {
    currentNumber = 0
    numbers = []
    operation = null
}

const digitButtonHandler = e => {
    const digit = e.currentTarget.innerText
    // console.log(digit)
    addDigit(digit)
    updateDisplay()
}

const addDigit = (digit) => {
    if (String(currentNumber).length >= 8) return
    if (currentNumber === 0) {
        currentNumber = digit
        console.log(currentNumber)
        return
    }
    console.log(String(currentNumber) + String(digit))
    currentNumber = String(currentNumber) + String(digit)
    console.log(currentNumber)
}

const saveNumber = (number) => {
    numbers = numbers.concat([currentNumber])
}

// Operations
const add = (a, b) => Number(a) + Number(b)
const subtract = (a, b) => Number(a) - Number(b)
const multiply = (a, b) => Number(a) * Number(b)
const divide = (a, b) => Number(a) / Number(b)

const selectOperation = strOperation => {
    switch (strOperation) {
        case 'add':
        return add
        case 'subtract':
        return subtract
        case 'multiply':
        return multiply
        case 'divide':
        return divide
    }
}

// Digit buttons: add digit to current number
const digitBtnArr = Array.from(document.getElementsByClassName('btn-digit'))
digitBtnArr.forEach(btn => btn.addEventListener('click', digitButtonHandler))

const acButton = document.getElementById('ac-btn')
acButton.addEventListener('click', e => {
    resetCalc()
    updateDisplay()
})

const plusMinusBtn = document.getElementById('plus-minus-btn')
plusMinusBtn.addEventListener('click', e => {
    currentNumber *= -1
    updateDisplay()
})

const operatorBtnArr = Array.from(document.getElementsByClassName('btn-operator'))
operatorBtnArr.forEach(btn => btn.addEventListener('click', e => {
    saveNumber(currentNumber)
    if (e.currentTarget.dataset.operation) {
        operation = selectOperation(e.currentTarget.dataset.operation)
        currentNumber = 0
        console.log(e.currentTarget.dataset.operation, operation)
    } else if (numbers.length === 2 && operation) {
        // This would be the equal button case
        console.log(numbers, operation)
        const result = operation(numbers[0], numbers[1])
        console.log(result)
        updateDisplay(result)
        resetCalc()
    }
}))

const display = document.getElementById('display')
updateDisplay()
