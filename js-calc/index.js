'use static'

const operationsKey = {
    add: {
        symbol: '+',
        fn: (a, b) => Number(a) + Number(b)
    },
    subtract: {
        symbol: '-',
        fn: (a, b) => Number(a) - Number(b)
    },
    multiply: {
        symbol: 'x',
        fn: (a, b) => Number(a) * Number(b)
    },
    divide: {
        symbol: '/',
        fn: (a, b) => Number(a) / Number(b)
    },
}

const calculator = {

    displayElem: document.getElementById('display'),
    operationDisplayElem: document.getElementById('operation-display'),
    currentNumber: 0,
    lastInput: '',
    numbers: [],
    operations: [],

    reset: function() {
        this.currentNumber = 0
        this.numbers = []
        this.operations = []
        this.updateDisplay()
    },

    addDigit: function(digit) {
        if (this.lastInput === 'equal') this.reset()
        if (String(this.currentNumber).length >= 8) return
        if (this.currentNumber === 0) {
            this.currentNumber = digit
        } else {
        console.log(digit)
            this.currentNumber = String(this.currentNumber) + String(digit)
            // this.currentNumber = String(this.currentNumber) + String(digit)
        }
        this.updateDisplay()
        this.lastInput = 'digit'
    },

    invertNumber: function() {
        this.currentNumber *= -1
        this.updateDisplay()
    },

    saveNumber: function(num) {
        num = num || this.currentNumber
        this.numbers.push(num)
        this.currentNumber = 0
        // don't update display, when clicking an operation button the currentNumber stays displayed
    },

    setOperation: function (strOperation) {
        if (this.lastInput === 'digit') {
            this.saveNumber()
        } else if (this.lastInput === 'operation') {
            this.operations.pop()
        }
        this.operations.push(operationsKey[strOperation].fn)
        this.lastInput = 'operation'
    },

    calculate: function() {
        const answer = this.numbers.reduce((acc, x, i, all) =>
            this.operations[i - 1](acc, x))
        this.updateDisplay(answer)
        return answer
    },

    updateDisplay: function(num) {
        num = num || this.currentNumber
        this.displayElem.innerText = String(num)
        const lastOperation = this.operations[this.operations.length - 1]
        const symbol = operationsKey[lastOperation]
        this.operationDisplayElem.innerText = symbol || ''
    }
}

// Digit buttons: add digit to current number
const digitBtnHandler = e => {
    const digit = e.currentTarget.innerText
    calculator.addDigit(digit)
}

const digitBtnArr = Array.from(document.getElementsByClassName('btn-digit'))
digitBtnArr.forEach(btn => btn.addEventListener('click', digitBtnHandler))

const acButton = document.getElementById('ac-btn')
acButton.addEventListener('click', e => { calculator.reset() })

const invertBtn = document.getElementById('invert-btn')
invertBtn.addEventListener('click', e => { calculator.invertNumber() })

const operationBtnHandler = e => {
    calculator.setOperation(e.currentTarget.dataset.operation)
}

const operatorBtnArr = Array.from(document.getElementsByClassName('btn-operator'))
operatorBtnArr.forEach(btn => btn.addEventListener('click', operationBtnHandler))

const eqBtnHandler = e => {
    if (calculator.lastInput === 'digit') {
        calculator.saveNumber()
    }
    console.log(calculator.numbers, calculator.operations)
    if (calculator.numbers.length > 1 && calculator.operations.length > 0) {
        calculator.calculate()
    }
    calculator.lastInput = 'equal'
}

document.getElementById('btn-eq').addEventListener('click', eqBtnHandler)

calculator.updateDisplay()
