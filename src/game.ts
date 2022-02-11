class Ship {
  public name: string
  public length: number
  public isHorizontal: boolean
  private cellsLeft: number
  public hasSunk: boolean

  constructor(name: string, length: number) {
    this.name = name
    this.length = length
    this.isHorizontal = true
    this.cellsLeft = length
    this.hasSunk = false
  }

  /**
   * Rotates the ship.
   */
  public changeDirection() {
    this.isHorizontal = !this.isHorizontal
  }

  /**
   * Reduces the amount of cells left alive of the ship, and
   * checks if the ship has been sunk.
   * @returns True if the ship has sunk.
   */
  public hit() {
    this.cellsLeft--
    this.hasSunk = this.cellsLeft === 0
    return this.hasSunk
  }
}

class Player {
  public grid: (null | Ship)[][]
  public ships: Ship[]
  public nextShipToPlace: Ship
  public hasShipsLeftToPlace: boolean
  public id: number

  constructor(id: number) {
    this.id = id

    this.grid = this.generateGrid()

    this.ships = []
    const shipTypes = {
      carrier: 5,
      battleship: 4,
      cruiser: 3,
      submarine: 3,
      destroyer: 2,
    }
    for (const [key, value] of Object.entries(shipTypes)) {
      this.ships.push(new Ship(key, value))
    }

    this.nextShipToPlace = this.ships[0]
    this.hasShipsLeftToPlace = true
  }

  /**
   * Creates a 10x10 grid to use as a game board.
   * @returns The filled grid.
   */
  private generateGrid() {
    const matrix = []
    for (let y = 0; y < 10; y++) {
      const row = []
      for (let x = 0; x < 10; x++) {
        row.push(null)
      }
      matrix.push(row)
    }
    return matrix
  }

  /**
   * Fires at the given coordinates. Does not check if the given
   * coordinates have previously been fired at already.
   * @param x Horizontal position to fire at.
   * @param y Vertical position to fire at.
   * @returns False if the shot missed, ship name and sate if the shot hit.
   */
  public getsfiredAt(x: number, y: number) {
    const cellToHit = this.grid[y][x]
    if (cellToHit === null) {
      return false
    } else {
      this.grid[y][x] = null
      return { name: cellToHit.name, hasSunk: cellToHit.hit() }
    }
  }

  /**
   * Checks if player has any ships left alive.
   * @returns True if any ships are left.
   */
  public hasShipsLeft() {
    return this.ships.some((ship) => !ship.hasSunk)
  }

  /**
   * Places the next ship with the origin at the given coordinates,
   * if possible.
   * @param x Horizontal position to place origin at.
   * @param y Vertical position to place origin at.
   * @returns True if the ship could be placed.
   */
  public placeNextShipAt(x: number, y: number) {
    if (this.nextShipToPlace === null) return

    const isLegalPlacement = this.canPlaceNextShipAt(x, y)

    if (isLegalPlacement) {
      // place currentShip at all position it occupies in the grid
      for (let i = 0; i < this.nextShipToPlace.length; i++) {
        if (this.nextShipToPlace.isHorizontal) {
          this.grid[y][x + i] = this.nextShipToPlace
        } else {
          this.grid[y + i][x] = this.nextShipToPlace
        }
      }

      const nextShipIndex = this.ships.indexOf(this.nextShipToPlace) + 1
      if (nextShipIndex !== this.ships.length) {
        this.nextShipToPlace = this.ships[nextShipIndex]
      } else {
        this.hasShipsLeftToPlace = false
      }
    }

    return isLegalPlacement
  }

  /**
   * Checks if a ship can be placed at a given origin.
   * @param x Horizontal position to place origin at.
   * @param y Vetical position to palce origin at.
   * @returns True if the ship can be placed.
   */
  public canPlaceNextShipAt(x: number, y: number) {
    if (!this.nextShipToPlace) return false

    for (let i = 0; i < this.nextShipToPlace.length; i++) {
      let xToCheck = x
      let yToCheck = y

      this.nextShipToPlace.isHorizontal
        ? (xToCheck = x + i)
        : (yToCheck = y + i)

      // Check potential out of bounds
      if (xToCheck === 10 || yToCheck === 10) return false

      // Check if the cell is already occupied
      if (this.grid[yToCheck][xToCheck]) {
        return false
      }
    }

    // All checks passed
    return true
  }
}

// Shared game variables
let players: Player[]
let currentPlayer: Player
let gameHasEnded = false
let placementPhaseActive: boolean

/**
 * Initialises the game by creating two new players.
 * This function is called automatically after importing the game module.
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

function placementFinished() {
  return !placementPhaseActive
}

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
