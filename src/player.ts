import { Ship } from './ship.js'

export class Player {
  private grid: (null | Ship)[][]
  private ships: Ship[]
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
