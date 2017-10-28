'use static'

let DISP_WIDTH
let DISP_FONT

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
        symbol: '÷',
        fn: (a, b) => Number(a) / Number(b)
    },
}

const calculator = {

    displayElem: document.getElementById('display'),
    histDisplayElem: document.getElementById('history-display'),
    resetBtnElem: document.getElementById('ac-btn'),
    currentNumber: 0,
    lastInput: '',
    numbers: [],
    operations: [],

    reset: function() {
        this.lastInput = ''
        this.currentNumber = 0
        this.numbers = []
        this.operations = []
        this.updateDisplay()
    },

    resetDisplay: function() {
        this.currentNumber = ''
        this.updateDisplay()
    },

    addDigit: function(digit, number) {
        if (this.lastInput === "equal") this.reset()
        else if (this.lastInput === "operation") this.currentNumber = 0
        number = typeof number !== "undefined" ? number : this.currentNumber

        if (String(number).length >= 30) return number
        if (digit === '.' && String(number).includes('.')) return number
        if (digit === '.' && number === 0) {
            number = '0.'
        } else if (number === 0) {
            number = digit
        } else {
            number = String(number) + String(digit)
        }
        this.currentNumber = number
        this.lastInput = "digit"
        this.updateDisplay()
        return number
    },

    invertNumber: function(number) {
        if (this.lastInput === 'equal') {
            number = typeof number !== "undefined" ? number : this.calculate()
        } else if (this.lastInput === 'digit') {
            number = typeof number !== "undefined" ? number : this.currentNumber
        } else return

        number *= -1
        this.currentNumber = number
        this.updateDisplay()
        return number
    },

    percentNumber: function(currentNumber, numbers) {
        if (numbers.length === 0) return currentNumber / 100
        return numbers[numbers.length - 1] * currentNumber / 100
    },

    saveNumber: function(newNumber, numbers) {
        newNumber = typeof newNumber !== "undefined" ? newNumber : this.currentNumber
        numbers = typeof numbers !== "undefined" ? numbers : this.numbers
        numbers.push(newNumber)
        this.numbers = numbers
        return numbers
        // don't update display, when clicking an operation button the currentNumber stays displayed
    },

    setOperation: function (strOperation, operations) {
        operations = typeof operations !== "undefined" ? operations : this.operations
        if (this.lastInput === "digit") {
            this.saveNumber()
        } else if (this.lastInput === "operation") {
            operations.pop()
        }
        operations.push(operationsKey[strOperation].fn)
        this.operations = operations
        this.lastInput = "operation"
        this.calculate()
        return operations
    },

    calculate: function(numbers, operations) {
        numbers = typeof numbers !== "undefined" ? numbers : this.numbers.slice()
        // make sure we have the correct proportion of numbers and opertaions
        operations = typeof operations !== "undefined" ? operations : this.operations.slice(0, numbers.length - 1)

        // Reduce the array by performing first multiplication and division

        let i = 0;
        while (i < operations.length) {
            if (
                operations[i] === operationsKey.multiply.fn ||
                operations[i] === operationsKey.divide.fn) {
                numbers[i] = operations[i](numbers[i], numbers[i + 1])
                numbers.splice(i + 1, 1)
                operations.splice(i, 1)
            } else {
                i++
            }
        }

        // Reduce further the rest of the operations
        const answer = numbers.reduce((acc, x, i, all) =>
            operations[i - 1](acc, x))
        this.updateDisplay(answer)

        return answer
    },

    updateDisplay: function(num = this.currentNumber, displayElem = this.displayElem) {
        displayElem.innerText = String(num)
        displayElem.style.fontSize = DISP_FONT + "px"
        this.updateHistDisplay(this.histDisplayElem, this.numbers, this.operations)

        // console.log('display width:', this.displayElem.offsetWidth)

        while (displayElem.offsetWidth > DISP_WIDTH) {
            const fontSize = window.getComputedStyle(displayElem).fontSize.slice(0, -2) - 2
            // console.log('too large!', fontSize)
            displayElem.style.fontSize = fontSize + "px"
        }
    },

    updateHistDisplay: function(histDisplayElem, numbers, operations) {
        const history = numbers.reduce((acc, num, i) => {
            return acc.concat(num, this.getSymbol(operations[i]) || '')
        }, [])

        // console.log('last action:', this.lastInput)
        if (this.lastInput === 'digit') {
            history.push(this.currentNumber)
        }

        histDisplayElem.innerText = history.join(' ')
    },

    // returns the symbol of the operation for display
    getSymbol: function(operationFn) {
        if (!operationFn) return

        const value = Object.keys(operationsKey).find(x =>
            operationsKey[x].fn === operationFn)
        return operationsKey[value].symbol
    },

    resetBtn: function(resetBtnElem, lastInput) {
        if (lastInput === 'reset') {
            this.reset()
        } else if (lastInput === 'digit') {
            this.resetDisplay()
        } else if (lastInput === 'operation') {
            this.operations.pop()
            this.updateDisplay()
        }
        this.lastInput = 'reset'
    },

    resetBtnState: function(resetBtnElem, lastInput) {
        if (lastInput === 'digit') {
            resetBtnElem.innerText = 'C'
        } else if (lastInput === 'reset') {
            resetBtnElem.innerText = 'AC'
        }
    }

}

// Digit buttons: add digit to current number
const digitBtnHandler = e => {
    const digit = e.currentTarget.innerText
    calculator.addDigit(digit)
    calculator.resetBtnState(calculator.resetBtnElem, calculator.lastInput)
}

Array.from(document.getElementsByClassName('btn-digit'))
.forEach(btn => btn.addEventListener('click', digitBtnHandler))

// Reset button
const resetHandler = e => {
    calculator.resetBtn(calculator.resetBtnElem, calculator.lastInput)
    calculator.resetBtnState(calculator.resetBtnElem, calculator.lastInput)
}

document.getElementById('ac-btn')
.addEventListener('click', resetHandler)

// Invert button
document.getElementById('invert-btn')
.addEventListener('click', e => { calculator.invertNumber() })

// Percent button
document.getElementById('percent-btn')
.addEventListener('click', e => {
    const newCurrent = calculator.percentNumber(calculator.currentNumber, calculator.numbers)
    calculator.currentNumber = newCurrent
    calculator.updateDisplay()
})

// Operation button
const operationBtnHandler = e => {
    calculator.setOperation(e.currentTarget.dataset.operation)
}

Array.from(document.getElementsByClassName('btn-operator'))
.forEach(btn => btn.addEventListener('click', operationBtnHandler))

// Equal button
const eqBtnHandler = e => {
    if (calculator.lastInput === 'digit') {
        calculator.saveNumber()
    }
    calculator.lastInput = 'equal'
    if (calculator.numbers.length > 1 && calculator.operations.length > 0) {
        calculator.calculate()
    }
}

document.getElementById('btn-eq').addEventListener('click', eqBtnHandler)

// Keyboard input
const keyboardHandler = e => {
    console.log(e.key, typeof e.key)

    if (/^[\d.]$/.test(e.key)) {
        calculator.addDigit(e.key)
        console.log("it's a number")
    } else if (/^[\+\-/\*_%]$/.test(e.key)) {
        console.log("it's an operation")
        switch (e.key) {
            case "+":
                calculator.setOperation('add')
                break
            case "-":
                calculator.setOperation('subtract')
                break
            case "/":
                calculator.setOperation('divide')
                break
            case "*":
                calculator.setOperation('multiply')
                break
            case "_":
                calculator.invertNumber()
                break
            case "%":
                calculator.percentNumber(calculator.currentNumber, calculator.numbers)
                break
        }
    } else if (e.key === "Enter") {
        eqBtnHandler()
    } else if (e.key === "Escape" || e.key === "Backspace") {
        resetHandler()
    }
}

document.addEventListener('keydown', keyboardHandler)

// Start here
calculator.reset()
DISP_WIDTH = calculator.displayElem.offsetWidth
DISP_FONT = window.getComputedStyle(calculator.displayElem).fontSize.slice(0, -2)

// Test suit
function testCalc() {
    // addDigit
    console.log("addDigit test")
    const testAddDigit1 = calculator.addDigit(4, 18) == 184 ? 'success' : 'fail'
    console.log(testAddDigit1)
    const testAddDigit2 = calculator.addDigit(0, 18) == 180 ? 'success' : 'fail'
    console.log(testAddDigit2)
    const testAddDigit3 = calculator.addDigit(4, 0) == 4 ? 'success' : 'fail'
    console.log(testAddDigit3)
    const testAddDigit4 = calculator.addDigit(0, 0) == 0 ? 'success' : 'fail'
    console.log(testAddDigit4)
    const testAddDigit5 = calculator.addDigit(4, 12312138) == 12312138 ? 'success' : 'fail'
    console.log(testAddDigit5)

    // invertNumber
    console.log("invertNumber test")
    const testInvert1 = calculator.invertNumber(5) === -5 ? 'success' : 'fail'
    console.log(testInvert1)
    const testInvert2 = calculator.invertNumber(8) === -8 ? 'success' : 'fail'
    console.log(testInvert2)
    const testInvert3 = calculator.invertNumber(0) === 0 ? 'success' : 'fail'
    console.log(testInvert3)
    const testInvert4 = calculator.invertNumber(-5) === 5 ? 'success' : 'fail'
    console.log(testInvert4)

    // percentNumber
    console.log("percentNumber test")
    const testPercent1 = calculator.percentNumber(5, []) === 0.05 ? 'success' : 'fail'
    console.log(testPercent1)
    const testPercent2 = calculator.percentNumber(5, [100]) === 5 ? 'success' : 'fail'
    console.log(testPercent2)
    const testPercent3 = calculator.percentNumber(5, [1000]) === 50 ? 'success' : 'fail'
    console.log(testPercent3)
    const testPercent4 = calculator.percentNumber(5, [100, 50]) === 2.5 ? 'success' : 'fail'
    console.log(testPercent4)
    const testPercent5 = calculator.percentNumber(5, [100, 50]) !== 3.5 ? 'success' : 'fail'
    console.log(testPercent5)
    

    function arrayEq(arr1, arr2) {
        return arr1.length === arr2.length &&
            arr1.every((x, i) => x === arr2[i])
    }
    // arrayEq
    console.log("arrayEq test")
    const testArrayEq1 = arrayEq([1, 2, 3], [1, 2, 3]) ? 'success' : 'fail'
    console.log(testArrayEq1)
    const testArrayEq2 = !arrayEq([1, 2, 4], [1, 2, 3]) ? 'success' : 'fail'
    console.log(testArrayEq2)

    // saveNumber
    console.log("saveNumber test")
    const testSaveNumber1 = arrayEq(calculator.saveNumber(5, [1, 2, 3]), [1, 2, 3, 5]) ? 'success' : 'fail'
    console.log(testSaveNumber1)
    const testSaveNumber2 = arrayEq(calculator.saveNumber(5, []), [5]) ? 'success' : 'fail'
    console.log(testSaveNumber2)
    const testSaveNumber3 = arrayEq(calculator.saveNumber(0, [1, 3]), [1, 3, 0]) ? 'success' : 'fail'
    console.log(testSaveNumber3)
    const testSaveNumber4 = arrayEq(calculator.saveNumber(5, [5, 55, 555]), [5, 55, 555, 5]) ? 'success' : 'fail'
    console.log(testSaveNumber3)

    // setOperation
    console.log("setOperation test")
    const opArray = [
        operationsKey.add.fn,
        operationsKey.multiply.fn,
        operationsKey.divide.fn,
        operationsKey.subtract.fn
    ]
    const testSetOperation1 = arrayEq(calculator.setOperation(
        'add', opArray), [
        operationsKey.add.fn,
        operationsKey.multiply.fn,
        operationsKey.divide.fn,
        operationsKey.subtract.fn,
        operationsKey.add.fn
    ]) ? 'success' : 'fail'
    console.log(testSetOperation1)
    const testSetOperation2 = arrayEq(calculator.setOperation(
        'subtract', opArray), [
        operationsKey.add.fn,
        operationsKey.multiply.fn,
        operationsKey.divide.fn,
        operationsKey.subtract.fn,
        operationsKey.subtract.fn
    ]) ? 'success' : 'fail'
    console.log(testSetOperation2)
    const testSetOperation3 = arrayEq(calculator.setOperation(
        'multiply', opArray), [
        operationsKey.add.fn,
        operationsKey.multiply.fn,
        operationsKey.divide.fn,
        operationsKey.subtract.fn,
        operationsKey.multiply.fn
    ]) ? 'success' : 'fail'
    console.log(testSetOperation3)
    const testSetOperation4 = arrayEq(calculator.setOperation(
        'divide', opArray), [
        operationsKey.add.fn,
        operationsKey.multiply.fn,
        operationsKey.divide.fn,
        operationsKey.subtract.fn,
        operationsKey.divide.fn
    ]) ? 'success' : 'fail'
    console.log(testSetOperation4)

    // calculate
    console.log("calculate test")
    const testCalculate1 = calculator.calculate([3, 4], [operationsKey.add.fn]) === 7 ? 'success' : 'fail'
    console.log(testCalculate1)
    const testCalculate2 = calculator.calculate([3, 4], [operationsKey.subtract.fn]) === -1 ? 'success' : 'fail'
    console.log(testCalculate2)
    const testCalculate3 = calculator.calculate([3, 4], [operationsKey.multiply.fn]) === 12 ? 'success' : 'fail'
    console.log(testCalculate3)
    const testCalculate4 = calculator.calculate([3, 4], [operationsKey.divide.fn]) === 0.75 ? 'success' : 'fail'
    console.log(testCalculate4)
    const testCalculate5 = calculator.calculate([0, 3, 4], [operationsKey.multiply.fn, operationsKey.add.fn]) === 4 ? 'success' : 'fail'
    console.log(testCalculate5)
    const testCalculate6 = calculator.calculate([0, 3, 4], [operationsKey.subtract.fn, operationsKey.add.fn]) === 1 ? 'success' : 'fail'
    console.log(testCalculate6)
    const testCalculate7 = calculator.calculate([0, 3, 4], [operationsKey.subtract.fn, operationsKey.multiply.fn]) === -12 ? 'success' : 'fail'
    console.log(testCalculate7)
    const testCalculate8 = calculator.calculate([1, 3, 4], [operationsKey.subtract.fn, operationsKey.divide.fn]) === 0.25 ? 'success' : 'fail'
    console.log(testCalculate8)
    const testCalculate9 = calculator.calculate([4, 3, 2, 1], [operationsKey.add.fn, operationsKey.multiply.fn, operationsKey.multiply.fn, operationsKey.subtract.fn]) === 10 ? 'success' : 'fail'
    console.log(testCalculate9)
    const testCalculate10 = calculator.calculate([4, 3, 2, 1], [operationsKey.multiply.fn, operationsKey.add.fn, operationsKey.subtract.fn]) === 13 ? 'success' : 'fail'
    console.log(testCalculate10)
    const testCalculate11 = calculator.calculate([4, 3, 2, 1], [operationsKey.multiply.fn, operationsKey.divide.fn, operationsKey.subtract.fn]) === 5 ? 'success' : 'fail'
    console.log(testCalculate11)
    const testCalculate12 = calculator.calculate([4, 3, 2, 1], [operationsKey.add.fn, operationsKey.multiply.fn, operationsKey.subtract.fn]) === 9 ? 'success' : 'fail'
    console.log(testCalculate12)
    const testCalculate13 = calculator.calculate([4, 3, 2, 1], [operationsKey.add.fn, operationsKey.divide.fn, operationsKey.multiply.fn]) === 5.5 ? 'success' : 'fail'
    console.log(testCalculate13)
    const testCalculate14 = calculator.calculate([3, 4, 2, 1], [operationsKey.divide.fn, operationsKey.subtract.fn, operationsKey.multiply.fn]) === -1.25 ? 'success' : 'fail'
    console.log(testCalculate14)
    const testCalculate15 = calculator.calculate([4, 3, 2, 1], [operationsKey.multiply.fn, operationsKey.divide.fn, operationsKey.divide.fn]) === 6 ? 'success' : 'fail'
    console.log(testCalculate15)
    const testCalculate16 = calculator.calculate([4, 3, 2, 1], [operationsKey.subtract.fn, operationsKey.divide.fn, operationsKey.divide.fn]) === 2.5 ? 'success' : 'fail'
    console.log(testCalculate16)
}
