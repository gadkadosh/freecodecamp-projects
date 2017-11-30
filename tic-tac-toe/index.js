'use strict'

// const X_SYM = 'X'
const X_SYM = '𐌗'
// const X_SYM = 'ᚷ'
// const X_SYM = '☓'
// const X_SYM = '×'
const O_SYM = '𐌏'
// const O_SYM = '⚬'

// currentPlayer can be 'player' or 'computer'
let currentPlayer = 'player'

const rows = Array.from(document.getElementById('board').children)
const tiles = rows.reduce((acc, row) => {
    return acc.concat(...row.children)
}, [])
const gameStatusElem = document.getElementById('game-status')

console.log(tiles)

function isGameWon(tiles) {
    
}

function drawLine() {
    
}

function isGameOver(tiles) {
    return tiles.filter(tile => isTileEmpty(tile)).length === 0
}

function updateGameStatus(gameStatusElem) {
    if (isGameOver(tiles)) {
        gameStatusElem.innerText = "Game over. Start over?"
    } else if (currentPlayer === 'player') {
        gameStatusElem.innerText = "It's your turn"
    } else if (currentPlayer === 'computer') {
        gameStatusElem.innerText = "Computer's turn"
    }
}

function isTileEmpty(tile) {
    return tile.innerText.trim() === ''
}

tiles.forEach((tile, i) => {
    tile.addEventListener('click', function(event) {
        if (!isTileEmpty(tile)) return
        if (currentPlayer === 'player') {
            tile.innerText = X_SYM
            currentPlayer = 'computer'
        } else if (currentPlayer === 'computer') {
            tile.innerText = O_SYM
            currentPlayer = 'player'
        }
        updateGameStatus(gameStatusElem)
    })
})

updateGameStatus(gameStatusElem)
