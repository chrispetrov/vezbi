//Display
import { TILE_STATUS, createBoard , markTile ,revealTile ,checkWin,checkLose} from "./minesweaper.js";

const BOARD_SIZE=10;
const NUMBER_OF_MINES=2;
const board=createBoard(BOARD_SIZE,NUMBER_OF_MINES)
const boardElement=document.querySelector('.board')
const minesLeftCounter=document.querySelector('[data-mine-count]')
const subText = document.querySelector('.subtext')



board.forEach(row =>{
    row.forEach(tile=>{
        boardElement.append(tile.element)
        tile.element.addEventListener('click', () => {
            revealTile(board,tile)
            checkGameEnd()
        })
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})

boardElement.style.setProperty('--size',BOARD_SIZE)
minesLeftCounter.textContent=NUMBER_OF_MINES

function listMinesLeft(){
    const markedTilesCount= board.reduce((count,row) => {
        return count + row.filter(tile => tile.status===TILE_STATUS.MARKED).length
    },0)
    minesLeftCounter.textContent= NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd(){
    const win = checkWin(board)
    const lose = checkLose(board)

    if(win || lose){
        boardElement.addEventListener("click", stopProp, { capture: true })
        boardElement.addEventListener("contextmenu", stopProp, { capture: true })
        console.log('Stop Prop function')
    }

    if(win){
        subText.textContent= "You WIN"
    }
    if(lose){
        subText.textContent= "You LOSE"
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status=== TILE_STATUS.MARKED) markTile(tile)
                if(tile.mine) revealTile(board,tile)
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
  }

//4.Check for win/loss


