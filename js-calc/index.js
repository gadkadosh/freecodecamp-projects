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
        symbol: '÷',
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
        this.lastInput = ''
        this.currentNumber = 0
        this.numbers = []
        this.operations = []
        this.updateDisplay()
    },

    addDigit: function(digit, number) {
        if (this.lastInput === "equal") this.reset()
        else if (this.lastInput === "operation") this.currentNumber = 0
        number = typeof number !== "undefined" ? number : this.currentNumber
        // console.log(digit, number)
        if (String(number).length >= 8) return number
        if (number === 0) {
            number = digit
        } else {
            number = Number(String(number) + String(digit))
        }
        this.currentNumber = number
        // console.log(digit, number)
        this.updateDisplay()
        this.lastInput = "digit"
        return number
    },

    invertNumber: function(number) {
        number = typeof number !== "undefined" ? number : this.currentNumber
        number *= -1
        this.currentNumber = number
        this.updateDisplay()
        return number
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
        this.calculate()
        this.lastInput = "operation"
        return operations
    },

    calculate: function(numbers, operations) {
        numbers = typeof numbers !== "undefined" ? numbers : this.numbers
        operations = typeof operations !== "undefined" ? operations : this.operations

        // Reduce the array by performing first multiplication and division
        const numbersCopy = numbers.slice()
        // const numbersCopy = numbers
        const operationsCopy = operations.slice(0, numbersCopy.length - 1)
        // console.log('copy:', operationsCopy.slice(), numbersCopy.slice())
        // make sure we have the correct proportion of numbers and opertaions
        // const operationsCopy = operations.slice(0, numbersCopy.length)

        let i = 0;
        while (i < operationsCopy.length) {
            if (
                operationsCopy[i] === operationsKey.multiply.fn ||
                operationsCopy[i] === operationsKey.divide.fn) {
                // console.log('found:', operationsCopy[i], numbersCopy[i],numbersCopy[i + 1],
                // operationsCopy[i](numbersCopy[i], numbersCopy[i + 1]))
                numbersCopy[i] = operationsCopy[i](numbersCopy[i], numbersCopy[i + 1])
                // console.log('during:', i, operationsCopy.slice(), numbersCopy.slice())
                numbersCopy.splice(i + 1, 1)
                operationsCopy.splice(i, 1)
                // console.log('during:', i, operationsCopy.slice(), numbersCopy.slice())

            } else {
                i++
            }
        }
        // console.log('after:', operationsCopy.slice(), numbersCopy.slice())

        // Reduce further the rest of the operations
        const answer = numbersCopy.reduce((acc, x, i, all) =>
            operationsCopy[i - 1](acc, x))
        this.updateDisplay(answer)

        // console.log(answer)

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

    getSymbol: function (operationFn) {
        return symbol = Object.keys(operationsKey).reduce((acc, val) => {
            if (operationsKey[val].fn === operationFn) {
                return operationsKey[val].symbol
            }
            return acc
        }, undefined)
    },

    justFunc: function(arr) {
            console.log(arr)
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
    console.log(calculator.operations, calculator.numbers)
    if (calculator.numbers.length > 1 && calculator.operations.length > 0) {
        calculator.calculate()
    }
    calculator.lastInput = 'equal'
}

document.getElementById('btn-eq').addEventListener('click', eqBtnHandler)

calculator.updateDisplay()

function testCalc() {
    // addDigit
    console.log("addDigit test")
    const testAddDigit1 = calculator.addDigit(4, 18) === 184 ? 'success' : 'fail'
    console.log(testAddDigit1)
    const testAddDigit2 = calculator.addDigit(0, 18) === 180 ? 'success' : 'fail'
    console.log(testAddDigit2)
    const testAddDigit3 = calculator.addDigit(4, 0) === 4 ? 'success' : 'fail'
    console.log(testAddDigit3)
    const testAddDigit4 = calculator.addDigit(0, 0) === 0 ? 'success' : 'fail'
    console.log(testAddDigit4)
    const testAddDigit5 = calculator.addDigit(4, 12312138) === 12312138 ? 'success' : 'fail'
    console.log(testAddDigit5)

    // invertNumber
    console.log("invertNumber test")
    const testInvert1 = calculator.invertNumber(5) === -5 ?'success' : 'fail'
    console.log(testInvert1)
    const testInvert2 = calculator.invertNumber(8) === -8 ?'success' : 'fail'
    console.log(testInvert2)
    const testInvert3 = calculator.invertNumber(0) === 0 ?'success' : 'fail'
    console.log(testInvert3)
    const testInvert4 = calculator.invertNumber(-5) === 5 ?'success' : 'fail'
    console.log(testInvert4)

    function arrayEq(arr1, arr2) {
        return arr1.length === arr2.length &&
            arr1.every((x, i) => x === arr2[i])
    }
    // arrayEq
    console.log("arrayEq test")
    const testArrayEq1 = arrayEq([1, 2, 3], [1, 2, 3]) ?'success' : 'fail'
    console.log(testArrayEq1)
    const testArrayEq2 = !arrayEq([1, 2, 4], [1, 2, 3]) ?'success' : 'fail'
    console.log(testArrayEq2)

    // saveNumber
    console.log("saveNumber test")
    const testSaveNumber1 = arrayEq(calculator.saveNumber(5, [1, 2, 3]), [1, 2, 3, 5]) ?'success' : 'fail'
    console.log(testSaveNumber1)
    const testSaveNumber2 = arrayEq(calculator.saveNumber(5, []), [5]) ?'success' : 'fail'
    console.log(testSaveNumber2)
    const testSaveNumber3 = arrayEq(calculator.saveNumber(0, [1, 3]), [1, 3, 0]) ?'success' : 'fail'
    console.log(testSaveNumber3)
    const testSaveNumber4 = arrayEq(calculator.saveNumber(5, [5, 55, 555]), [5, 55, 555, 5]) ?'success' : 'fail'
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
    ]) ?'success' : 'fail'
    console.log(testSetOperation1)
    const testSetOperation2 = arrayEq(calculator.setOperation(
        'subtract', opArray), [
        operationsKey.add.fn,
        operationsKey.multiply.fn,
        operationsKey.divide.fn,
        operationsKey.subtract.fn,
        operationsKey.subtract.fn
    ]) ?'success' : 'fail'
    console.log(testSetOperation2)
    const testSetOperation3 = arrayEq(calculator.setOperation(
        'multiply', opArray), [
        operationsKey.add.fn,
        operationsKey.multiply.fn,
        operationsKey.divide.fn,
        operationsKey.subtract.fn,
        operationsKey.multiply.fn
    ]) ?'success' : 'fail'
    console.log(testSetOperation3)
    const testSetOperation4 = arrayEq(calculator.setOperation(
        'divide', opArray), [
        operationsKey.add.fn,
        operationsKey.multiply.fn,
        operationsKey.divide.fn,
        operationsKey.subtract.fn,
        operationsKey.divide.fn
    ]) ?'success' : 'fail'
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
