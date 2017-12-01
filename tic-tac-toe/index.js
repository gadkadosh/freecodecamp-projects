'use strict'

const X_SYM = '𐌗'
const O_SYM = '𐌏'

const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const players = {}
players[X_SYM] = 'Player'
players[O_SYM] = 'Computer'

// currentPlayer can be 'player' or 'computer'
let playing = false
let currentPlayer = 'player'

const rows = Array.from(document.getElementById('board').children)
const tiles = rows.reduce((acc, row) => {
    return acc.concat(...row.children)
}, [])
const gameStatusElem = document.getElementById('game-status')
const startOverBtn = document.getElementById('start-over')

console.log(tiles)

function isGameWon(tiles) {
    const contentTiles = tiles.map(tile => tile.innerText)
    return winCombinations.find(c => {
        return contentTiles[c[0]] !== '' &&
            contentTiles[c[0]] === contentTiles[c[1]] &&
            contentTiles[c[0]] === contentTiles[c[2]]
    })
}

function drawLine(combination, tiles) {
    combination.forEach(c => {
        tiles[c].classList.add('win-tile')
    })
}

function computerMove(tiles) {
    // for each winning combination check the tiles:
    // 1. if there is only one empty, check if other two are taken by player
    for (let i = 0; i < winCombinations.length; i++) {
        const combTiles = winCombinations[i].map(index => ({ index: index, tile: tiles[index] }))
        const empty = combTiles.filter(t => isTileEmpty(t.tile))
        if (empty.length === 1 &&
            combTiles.filter(t => t.tile.innerText === O_SYM).length === 2) {
            return empty[0].index
        }
    }
    // 2. if nothing came out of that check again each winning combination tiles:
    // computer has two and one is empty - take the empty and win
    for (let i = 0; i < winCombinations.length; i++) {
        const combTiles = winCombinations[i].map(index => ({ index: index, tile: tiles[index] }))
        const empty = combTiles.filter(t => isTileEmpty(t.tile))
        if (empty.length === 1 &&
            combTiles.filter(t => t.tile.innerText === X_SYM).length === 2) {
            return empty[0].index
        }
    }
    // 3. computer has one and two are empty - take one of the empty ones
    for (let i = 0; i < winCombinations.length; i++) {
        const combTiles = winCombinations[i].map(index => ({ index: index, tile: tiles[index] }))
        const empty = combTiles.filter(t => isTileEmpty(t.tile))
        if (empty.length === 2 &&
            combTiles.filter(t => t.tile.innerText === O_SYM).length === 1) {
            return empty[Math.floor(Math.random() * 2)].index
        }
    }

    const empty = tiles.filter(t => isTileEmpty(t))
    console.log(empty)
    const rank = empty.map((t, i) => {
        winCombinations.reduce((acc, val) => {
            if (val.includes(i)) {
                return acc + 1
            }
            return acc
        }, 0)
    })

    // 4. choose from a completely empty combination (random)
    let choice
    do {
        choice = Math.floor(Math.random() * tiles.length)
    } while (!isTileEmpty(tiles[choice]))

    return choice
}

function isGameOver(tiles) {
    return tiles.filter(tile => isTileEmpty(tile)).length === 0
}

function updateGameStatus(tiles, gameStatusElem) {
    const won = isGameWon(tiles)
    if (won) {
        const playerWon = players[tiles[won[0]].innerText]
        gameStatusElem.innerText = playerWon + " won!"
        drawLine(won, tiles)
        playing = false
    } else if (isGameOver(tiles)) {
        gameStatusElem.innerText = "Game Over"
        playing = false
    } else if (currentPlayer === 'player') {
        gameStatusElem.innerText = "It's your turn"
    } else if (currentPlayer === 'computer') {
        gameStatusElem.innerText = "Computer's turn"
        const move = computerMove(tiles)
        fillTile(tiles[move])
    }

    // Hide start over button if board is empty
    if (tiles.every(isTileEmpty)) {
        startOverBtn.classList.add('hidden')
    } else {
        startOverBtn.classList.remove('hidden')
    }
}

function isTileEmpty(tile) {
    return tile.innerText.trim() === ''
}

function fillTile(tile) {
    if (currentPlayer === 'player') {
        tile.innerText = X_SYM
        currentPlayer = 'computer'
    } else if (currentPlayer === 'computer') {
        tile.innerText = O_SYM
        currentPlayer = 'player'
    }
    updateGameStatus(tiles, gameStatusElem)
}

function clearBoard(tiles) {
    tiles.forEach(tile => {
        tile.innerText = ''
        tile.classList.remove('win-tile')
    })
}

function startGame() {
    clearBoard(tiles)
    playing = true

    tiles.forEach((tile, i) => {
        tile.addEventListener('click', function(event) {
            if (!playing) return
            if (!isTileEmpty(tile)) return
            fillTile(tile)
        })
    })

    startOverBtn.addEventListener('click', function(e) {
        clearBoard(tiles)
        currentPlayer = 'player'
        playing = true
        updateGameStatus(tiles, gameStatusElem)
    })

    updateGameStatus(tiles, gameStatusElem)
}

startGame(tiles)
