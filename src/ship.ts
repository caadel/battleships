export class Ship {
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
    this.hasSunk = this.cellsLeft <= 0
    return this.hasSunk
  }
}
