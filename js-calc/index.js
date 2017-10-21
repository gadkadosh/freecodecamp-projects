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
    histDisplayElem: document.getElementById('history-display'),
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
        // console.log(digit)
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
        // if (this.operations.length > 1)
        this.calculate()
        this.lastInput = 'operation'
    },

    calculate: function() {
        // Reduce the array by performing first multiplication and division
        numbersCopy = this.numbers.slice()
        operationsCopy = this.operations.slice(0, numbersCopy.length - 1)

        let i = 0;
        while (i < operationsCopy.length) {
            if (operationsCopy[i] === operationsKey.multiply.fn ||
                operationsCopy[i] === operationsKey.divide.fn) {
                numbersCopy[i] = this.operations[i](numbersCopy[i], numbersCopy[i + 1])
                numbersCopy.splice(i + 1, 1)
                operationsCopy.splice(i, 1)
                console.log(operationsCopy, numbersCopy)
            } else {
                i++
            }
        }

        // Reduce further the rest of the operations
        const answer = numbersCopy.reduce((acc, x, i, all) =>
            operationsCopy[i - 1](acc, x))
        this.updateDisplay(answer)

        return answer
    },

    updateDisplay: function(num) {
        num = num || this.currentNumber
        this.displayElem.innerText = String(num)
        this.updateHistDisplay()
    },

    updateHistDisplay: function() {

        const history = this.numbers.reduce((acc, num, i) => {
            return acc.concat(num, this.getSymbol(this.operations[i]) || '')
        }, [])

        this.histDisplayElem.innerText = history.join(' ')
    },

    getSymbol: function(operationFn) {
        return symbol = Object.keys(operationsKey).reduce((acc, val) => {
            if (operationsKey[val].fn === operationFn) {
                return operationsKey[val].symbol
            }
            return acc
        }, undefined)
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
