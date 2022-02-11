import { Player } from './player.js'

// Shared game variables
let players: Player[]
let currentPlayer: Player
let gameHasEnded: boolean
let placementPhaseActive: boolean

/**
 * Initialises the game by creating two new players.
 * This function is called automatically once.
 */
function newGame() {
  players = [new Player(1), new Player(2)]
  currentPlayer = players[0]
  gameHasEnded = false
  placementPhaseActive = true
}
newGame()

/**
 * Performs one turn of the game:
 * Fires at the current players opponent and swaps the current player.
 * @param x Horizontal position to fire at.
 * @param y Vertical position to fire at.
 * @returns False if the shot missed, ship name and sate if the shot hit.
 */
function takeTurn(x: number, y: number) {
  swapCurrentPlayer() // shoot at opponent

  const hitResult = currentPlayer.getsfiredAt(x, y)

  if (!currentPlayer.hasShipsLeft()) {
    gameHasEnded = true
    // Current player is swapped to become the player who won

    swapCurrentPlayer()
  }

  return hitResult
}

/**
 * Swaps the currently active player.
 */
function swapCurrentPlayer() {
  currentPlayer === players[0]
    ? (currentPlayer = players[1])
    : (currentPlayer = players[0])
}

/**
 * Places a ship for the current player at the given coordinates.
 * @param x Horizontal position to place origin at.
 * @param y Vertical position to place origin at.
 * @returns True if the ship could be placed.
 */
function placeShipAt(x: number, y: number) {
  const shipWasPlaced = currentPlayer.placeNextShipAt(x, y)

  if (shipWasPlaced && !currentPlayer.hasShipsLeftToPlace) {
    swapCurrentPlayer()

    if (players.every((player) => !player.hasShipsLeftToPlace)) {
      placementPhaseActive = false
    }
  }

  return shipWasPlaced
}

/**
 * Checks if a ship can be placed at a given origin.
 * @param x Horizontal position to place origin at.
 * @param y Vetical position to palce origin at.
 * @returns True if the ship can be placed.
 */
function canPlaceShipAt(x: number, y: number) {
  return currentPlayer.canPlaceNextShipAt(x, y)
}

/**
 * Returns the current player's id.
 * @returns The player's id.
 */
function getCurrentPlayer() {
  return currentPlayer.id
}

/**
 * Returns some data about the next ship to place, instead of
 * returning the full ship object. Avoids creating a Ship dependency.
 * @returns Name, length, and isHorizontal.
 */
function getNextShipData() {
  const ship = currentPlayer.nextShipToPlace
  return {
    name: ship.name,
    length: ship.length,
    isHorizontal: ship.isHorizontal,
  }
}

/**
 * Rotates the current player's next ship to be placed.
 */
function rotateNextShip() {
  currentPlayer.nextShipToPlace?.changeDirection()
}

/**
 * Returns if the placement phase has been finished or not.
 * @returns True if all ships have been placed.
 */
function placementFinished() {
  return !placementPhaseActive
}

/**
 * Returns if the game has ended, i.e. if a player has won.
 * @returns True if the current player has won.
 */
function hasEnded() {
  return gameHasEnded
}

export default {
  newGame,
  getCurrentPlayer,
  takeTurn,
  placeShipAt,
  canPlaceShipAt,
  rotateNextShip,
  hasEnded,
  getNextShipData,
  swapCurrentPlayer,
  placementFinished,
}
