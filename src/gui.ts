const gameArea = document.body.appendChild(createElement('main', 'game-area'))
const player1Board = gameArea.appendChild(
  createElement('div', 'board', 'player-1')
)
const player2Board = gameArea.appendChild(
  createElement('div', 'board', 'player-2')
)

function init() {
  createBoard(player1Board)
  createBoard(player2Board)
  player1Board.classList.add('disabled')
}

/**
 * Adds grid cells to a an HTML element and sets up click events.
 * @param board The element to add the cells to.
 */
function createBoard(board: Element) {
  for (let i = 0; i < 100; i++) {
    board.appendChild(createElement('div'))
  }
  board.addEventListener('click', (e) => {
    const target = e.target

    if (target === board) return

    // TODO: Handle click on non-hit/missed tile here
    console.log(target)
  })
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
}
