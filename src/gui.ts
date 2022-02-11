/**
 * This module will only ever interact directly with the HTML.
 * It is responsible for updating UI elements based on input given
 * from the caller (i.e. the controller).
 *
 * gui.ts, style.css, and index.html essentially makes up the "View" in MVC.
 */

/**
 * These elements can be read by the controller after calling init(),
 * so the controller can listen to view events.
 */
const interactables = {
  player1Board: HTMLElement.prototype,
  player1SetupBoard: HTMLElement.prototype,
  player2Board: HTMLElement.prototype,
  player2SetupBoard: HTMLElement.prototype,
}
const currentPlayerDisplay = document.body.appendChild(
  createElement('h1', 'info-display')
)
const infoDisplay = document.body.appendChild(
  createElement('h3', 'info-display')
)

/**
 * Initialises GUI components.
 * @returns Game boards.
 */
function init() {
  // Create game and setup boards
  const gameArea = document.body.appendChild(createElement('main', 'game-area'))
  interactables.player1Board = gameArea.appendChild(
    createElement('div', 'board')
  )
  interactables.player2Board = gameArea.appendChild(
    createElement('div', 'board')
  )

  const setupArea = gameArea.appendChild(createElement('div', 'setup-area'))
  interactables.player1SetupBoard = setupArea.appendChild(
    createElement('div', 'setup-board')
  )
  interactables.player2SetupBoard = setupArea.appendChild(
    createElement('div', 'setup-board')
  )

  // Populate the boards
  populateBoard(interactables.player1SetupBoard)
  populateBoard(interactables.player1Board)
  populateBoard(interactables.player2Board)
  populateBoard(interactables.player2SetupBoard)

  // Add some written instructions
  const instructionTitle = createElement('h2', 'info-display')
  instructionTitle.innerText = 'Instructions'
  const instructions1 = createElement('div', 'info-display', 'instructions')
  instructions1.innerHTML = `<strong>When placing:</strong> click to place ship, right-click to rotate ship`
  const instructions2 = createElement('div', 'info-display', 'instructions')
  instructions2.innerHTML = `<strong>During firing:</strong> click to fire!`
  document.body.append(instructionTitle, instructions1, instructions2)

  return {
    interactables,
  }
}

/**
 * Updates the general information display area with the given text.
 * @param text Text content to show.
 */
function updateInfoDisplay(text: string) {
  infoDisplay.innerText = text
}

/**
 * Updates the current player text display.
 * @param id Player ID.
 */
function updatePlayerDisplay(id: number) {
  currentPlayerDisplay.innerText = `Player ${id}'s turn`
}

function markCellAsShip(cell: Element) {
  cell.classList.add('placement')
}

function markCellAsMiss(cell: Element) {
  cell.classList.add('hit')
}

function markCellAsHit(cell: Element) {
  cell.classList.add('hit')
}

function clearCell(cell: Element) {
  cell.classList.remove('placement')
}

function placeShipOnBoard(board: Element, x: number, y: number) {
  board.children[x * y].classList.add('placement')
}

/**
 * Shows the game or setup board of the given player.
 * Deactivates the board not in use.
 * @param isSetupPhase True if the setup-boards are to be shown.
 * @param isFirstPlayer True if the first player is to play.
 */
function showPlayerBoard(isSetupPhase: boolean, isFirstPlayer: boolean) {
  // setup = false, first = false
  let boardToHide = interactables.player2Board
  let boardToShow = interactables.player1Board

  if (isFirstPlayer) {
    if (!isSetupPhase) {
      // setup = false, first = true
      boardToHide = interactables.player1Board
      boardToShow = interactables.player2Board
    } else {
      // setup = true, first = true
      boardToHide = interactables.player2SetupBoard
      boardToShow = interactables.player1SetupBoard
    }
  } else if (isSetupPhase) {
    // setup = true, first = false
    boardToHide = interactables.player1SetupBoard
    boardToShow = interactables.player2SetupBoard

    for (const cell of interactables.player1SetupBoard.children) {
      clearCell(cell)
    }
  }

  boardToHide.classList.add('disabled')
  boardToShow.classList.remove('disabled')
}

/**
 * Removes the setup boards from the GUI by hiding them.
 */
function hideSetupArea() {
  interactables.player1SetupBoard.parentElement?.classList.add('hidden')
}

/**
 * Adds grid cells to a an HTML container.
 * @param board The container element to add the cells to.
 */
function populateBoard(board: Element) {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const element = createElement('div')
      element.dataset.x = x.toString()
      element.dataset.y = y.toString()
      board.appendChild(element)
    }
  }
}

/**
 * Creates a new HTML element and applies CSS classes to it.
 * @param tagname Name of the element's tag.
 * @param classes Optional classes to add to the element.
 * @returns The created element.
 */
function createElement(tagname: string, ...classes: string[]) {
  const element = document.createElement(tagname)
  element.classList.add(...classes)
  return element
}

export default {
  init,
  showPlayerBoard,
  updateInfoDisplay,
  updatePlayerDisplay,
  markCellAsShip,
  markCellAsHit,
  markCellAsMiss,
  clearCell,
  placeShipOnBoard,
  hideSetupArea,
}
