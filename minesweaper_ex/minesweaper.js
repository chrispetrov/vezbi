// Logic
export const TILE_STATUS ={
    HIDDEN: 'hidden',
    NUMBER: 'number',
    MINE: 'mine',
    MARKED : 'marked'
}

export function createBoard(boardSize, numMines){
    const board= []
    const minePositions= getMinePositions(boardSize,numMines)
    

    
    for(let x=0 ; x<boardSize; x++){
        const row=[]
        for(let y=0 ; y<boardSize; y++){
        const element= document.createElement('div')
        element.dataset.status=TILE_STATUS.HIDDEN

        const tile={
            element,
            x,
            y,
            mine: minePositions.some(p => positionMatch(p,{x,y})),
            get status(){
                return this.element.dataset.status
            },
            set status(value){
                this.element.dataset.status=value
            }
        }
        row.push(tile)
        }
        board.push(row)
    }
    return board
}

function getMinePositions(boardSize,numMines){
    const positions =[]
    while(positions.length < numMines){
        const position={
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        }
        if(!positions.some(p => positionMatch(p , position))){
            positions.push(position)
        }
    }

    return positions
}
function positionMatch(a ,b){
    return a.x === b.x && a.y === b.y
}

function randomNumber(boardSize){
    return Math.floor(Math.random()*boardSize)
}

export function markTile(tile){
    if(tile.status!==TILE_STATUS.HIDDEN && tile.status!==TILE_STATUS.MARKED){
        return
    }
    if(tile.status === TILE_STATUS.MARKED){
        tile.status=TILE_STATUS.HIDDEN
    }
    else {
        tile.status=TILE_STATUS.MARKED
    }
}

export function revealTile(board,tile){
    if(tile.status!== TILE_STATUS.HIDDEN){
        return 
    }
    if(tile.mine){
        tile.status=TILE_STATUS.MINE
        return
    }

    tile.status=TILE_STATUS.NUMBER
    const ajesentTiles = nearbyTiles(board,tile)
    const mines = ajesentTiles.filter(t => t.mine)

    if(mines.length === 0){
        ajesentTiles.forEach(revealTile.bind(null , board))
    }
    else{
        tile.element.textContent=mines.length
    }
}

function nearbyTiles(board,{x , y}){
    const tiles=[]
    
    for(let xOffset=-1 ; xOffset<=1 ;xOffset++){
        for(let yOffset=-1 ; yOffset<=1 ;yOffset++){
        const tile= board[x + xOffset]?.[y + yOffset]
        if(tile)tiles.push(tile)
        }
    }

    return tiles
}

export function checkWin(board){
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUS.NUMBER || (tile.mine && (tile.status=== TILE_STATUS.HIDDEN || tile.status=== TILE_STATUS.MARKED))
        })
    })

}

export function checkLose(board){
    return board.some(row => {
       return  row.some(tile => {
            return tile.status === TILE_STATUS.MINE
        })
    })
    
}