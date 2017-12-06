'use strict'

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

const players = {
    player1: {
        symbol: '𐌗',
    },
    player2: {
        symbol: '𐌏',
    }
}

let playing = false
let currentPlayer

const body = document.getElementsByTagName('body')[0]
const rows = Array.from(document.getElementById('board').children)
const tiles = rows.reduce((acc, row) => {
    return acc.concat(...row.children)
}, [])
const gameStatusElem = document.getElementById('game-status')
const startOverBtn = document.getElementById('start-over')
const playBtnContainer = document.getElementById('play-btn-container')
const playXBtn = document.getElementById('play-x')
const playOBtn = document.getElementById('play-o')

function isGameWon(tiles) {
    const contentTiles = tiles.map(tile => tile.innerText)
    const combination = winCombinations.find(c => {
        return contentTiles[c[0]] !== '' &&
            contentTiles[c[0]] === contentTiles[c[1]] &&
            contentTiles[c[0]] === contentTiles[c[2]]
    })
    if (combination !== undefined) {
        combination.forEach(c => {
            tiles[c].classList.add('win-tile')
        })
        return true
    }
    return false
}

function computerMove(tiles) {
    // For each winning combination check the tiles:
    const combTiles = winCombinations.map(comb =>
        comb.map(index => ({ index: index, tile: tiles[index] })))
    const empty = combTiles.map(comb =>
        comb.filter(t => isTileEmpty(t.tile)))

    // 1. if there is only one empty, check if other two are taken by player
    for (let i = 0; i < combTiles.length; i++) {
        if (empty[i].length === 1 &&
            combTiles[i].filter(t => t.tile.innerText === currentPlayer.symbol).length === 2) {
            return empty[i][0].index
        }
    }

    // 2. if nothing came out of that check again each winning combination tiles:
    // computer has two and one is empty - take the empty and win
    for (let i = 0; i < combTiles.length; i++) {
        if (empty[i].length === 1 &&
            combTiles[i].filter(t => t.tile.innerText !== currentPlayer.symbol &&
                !isTileEmpty(t.tile)).length === 2) {
            return empty[i][0].index
        }
    }

    // 3. computer has one and two are empty - take one of the empty ones
    for (let i = 0; i < combTiles.length; i++) {
        if (empty[i].length === 2 &&
            combTiles[i].filter(t => t.tile.innerText === currentPlayer.symbol).length === 1) {
            return empty[i][Math.floor(Math.random() * 2)].index
        }
    }

    // 4. Calculate which tile has most continuation paths and choose it
    // This doesn't take into account the current state of those tiles
    // This makes it impossible to win the game!
    const objTiles = tiles.map((tile, i) => ({ index: i, tile: tile }))
    const emptyTiles = objTiles.filter(tile => isTileEmpty(tile.tile))
    const rank = emptyTiles.map(tile => {
        const paths = winCombinations.reduce((acc, val) => {
            if (val.includes(tile.index)) {
                return acc + 1
            }
            return acc
        }, 0)
        return Object.assign({}, tile, { rank: paths })
    })
    const bestChoice = rank.reduce((acc, val) => {
        if (val.rank > acc.rank) return val
        return acc
    })
    return bestChoice.index
}

function isGameOver(tiles) {
    return tiles.filter(tile => isTileEmpty(tile)).length === 0
}

function updateGameStatus(tiles, gameStatusElem) {
    const won = isGameWon(tiles)
    if (isGameWon(tiles)) {
        gameStatusElem.innerText = currentPlayer.isComputer ? "Computer won!": "You won!"
    } else if (isGameOver(tiles)) {
        gameStatusElem.innerText = "Game over - it's a draw"
    } else if (!currentPlayer.isComputer) {
        gameStatusElem.innerText = "It's your turn"
    } else if (currentPlayer.isComputer) {
        gameStatusElem.innerText = "Computer's turn"
        const move = computerMove(tiles)
        fillTile(tiles[move])
    }
}

function isTileEmpty(tile) {
    return tile.innerText.trim() === ''
}

function fillTile(tile) {
    tile.innerText = currentPlayer.symbol
    if (isGameWon(tiles)) {
        updateGameStatus(tiles, gameStatusElem)
        playing = false
        return
    } else if (isGameOver(tiles)) {
        updateGameStatus(tiles, gameStatusElem)
        playing = false
        return
    } else if (currentPlayer === players.player1) {
        currentPlayer = players.player2
        gameStatusElem.innerText = "Computer's turn"
    } else if (currentPlayer === players.player2) {
        currentPlayer = players.player1
        gameStatusElem.innerText = "It's your turn"
    } 
    
    if (currentPlayer.isComputer) {
        fillTile(tiles[computerMove(tiles)])
    }
}

function clearBoard(tiles) {
    tiles.forEach(tile => {
        tile.innerText = ''
        tile.classList.remove('win-tile')
    })
}

function fadeOutElem(elem) {
    if (elem.classList.contains('d-none') || elem.classList.contains('hidden')) return
    elem.addEventListener('transitionend', 
        function transitionEnd(e) {
            elem.removeEventListener('transitionend', transitionEnd)
            elem.classList.add('d-none')
        })
    elem.classList.add('hidden')
}

function fadeInElem(elem) {
    elem.classList.remove('d-none')
    elem.classList.remove('hidden')
}

function startGame() {
    playing = true
    currentPlayer = players.player1
    body.classList.remove('bg-inactive')

    fadeOutElem(playBtnContainer)
    fadeInElem(startOverBtn)

    updateGameStatus(tiles, gameStatusElem)
}

function initGame() {
    playing = false
    gameStatusElem.innerText = ''
    clearBoard(tiles)
    body.classList.add('bg-inactive')

    fadeOutElem(startOverBtn)
    fadeInElem(playBtnContainer)
}

playXBtn.addEventListener('click', function(e) {
    players.player1.isComputer = false
    players.player2.isComputer = true
    startGame(tiles)
})

playOBtn.addEventListener('click', function(e) {
    players.player1.isComputer = true
    players.player2.isComputer = false
    startGame(tiles)
})

startOverBtn.addEventListener('click', initGame)

tiles.forEach((tile, i) => {
    tile.addEventListener('click', function(e) {
        if (!playing) return
        if (!isTileEmpty(tile)) return
        fillTile(tile)
    })
})

initGame()
