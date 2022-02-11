/**
 * In the controller we listen to events from the View and ask the
 * model to update its state.
 * The model returns the new state of the boards and the controller
 * asks the view to update itself accordingly.
 */

import GUI from './gui.js'
import Game from './game.js'

const UIElements = GUI.init().interactables

GUI.showPlayerBoard(true, 1)
GUI.updatePlayerDisplay(1)
promptNextPlacement()

createBoardEvents(UIElements.player1Board, UIElements.player2Board)
createSetupBoardEvents(
  UIElements.player1SetupBoard,
  UIElements.player2SetupBoard
)

/**
 * Creates necessary event listeners for firing during gameplay.
 * @param boards The game boards.
 */
function createBoardEvents(...boards: Element[]) {
  for (const board of boards) {
    board.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target === board) return

      const x = parseInt(target.dataset.x || '0')
      const y = parseInt(target.dataset.y || '0')

      const response = Game.takeTurn(x, y)

      if (response) {
        GUI.markCell(target, 'hit')
        let hitMsg = 'hit'
        if (response.hasSunk) hitMsg = 'sunk'
        GUI.updateInfoDisplay(`A ${response.name} was ${hitMsg}!`)

        if (Game.hasEnded()) {
          GUI.showGameOver(Game.getCurrentPlayer())
          return
        }
      } else {
        GUI.markCell(target, 'miss')
        GUI.updateInfoDisplay("It's a miss!")
      }
      GUI.updatePlayerDisplay(Game.getCurrentPlayer())
      GUI.showPlayerBoard(false, Game.getCurrentPlayer())
    })
  }
}

/**
 * Creates necessary event listeners for ship placement
 * on the given boards.
 * @param boards The setup boards.
 */
function createSetupBoardEvents(...boards: Element[]) {
  let previousPlacingPlayer = 1
  for (const board of boards) {
    let lastMarkedCells: HTMLElement[]

    // Enter a new cell
    board.addEventListener('mouseover', (e) => {
      lastMarkedCells = setupHoverHandler(board, e.target as Element, true)
    })

    // Exit the previous cell
    board.addEventListener('mouseout', (e) => {
      lastMarkedCells = setupHoverHandler(board, e.target as Element, false)
    })

    // Click on a cell (place ship)
    board.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target === board) return

      const x = parseInt(target.dataset.x || '0')
      const y = parseInt(target.dataset.y || '0')

      // If the ship was not placed, we do not not need to do anything
      if (!Game.placeShipAt(x, y)) return

      if (Game.placementFinished()) {
        GUI.showPlayerBoard(false, 1)
        GUI.hideSetupArea()
        GUI.updatePlayerDisplay(1)
        GUI.updateInfoDisplay('')
      } else {
        // Check if the placing player has changed (i.e. switch active board)
        const currentPlayer = Game.getCurrentPlayer()
        if (currentPlayer !== previousPlacingPlayer) {
          previousPlacingPlayer = currentPlayer
          GUI.showPlayerBoard(true, 2)
          GUI.updatePlayerDisplay(2)
        }

        promptNextPlacement()
      }
    })

    // Right-click on a cell (rotate ship)
    board.addEventListener('contextmenu', (e) => {
      e.preventDefault()

      Game.rotateNextShip()

      // Clear previous hovered cells and show the new cells after the rotation
      for (const item of lastMarkedCells) {
        GUI.clearCell(item)
      }
      lastMarkedCells = setupHoverHandler(board, e.target as Element, true)
    })
  }
}

function setupHoverHandler(
  board: Element,
  target: Element,
  enteredCell: boolean
) {
  if (target === board) return []

  const targetCell = target as HTMLElement
  const x = parseInt(targetCell.dataset.x || '0')
  const y = parseInt(targetCell.dataset.y || '0')
  const canPlaceShip = Game.canPlaceShipAt(x, y)

  // Only update the board if the ship can be placed at the coordinates
  if (!canPlaceShip) return []

  const shipData = Game.getNextShipData()

  const affectedCells = []

  for (let i = 0; i < shipData.length; i++) {
    let index = 10 * y + x + i
    if (!shipData.isHorizontal) index = 10 * y + i * 10 + x

    const currentCell = board.children[index] as HTMLElement

    // Set style on cell hover enter, clear in on cell hover exit
    if (enteredCell) {
      GUI.markCell(currentCell, 'placed')
      affectedCells.push(currentCell)
    } else GUI.clearCell(currentCell)
  }

  return affectedCells
}

function promptNextPlacement() {
  GUI.updateInfoDisplay(`Place your ${Game.getNextShipData().name}`)
}
