/* eslint-disable no-undef */
import { Ship } from '../src/ship.js'

test('Ship can be rotated', () => {
  const ship = new Ship('battleship', 4)

  expect(ship.isHorizontal).toBeTruthy()

  ship.changeDirection()

  expect(ship.isHorizontal).not.toBeTruthy()
})

test('Ship can be hit and sunk', () => {
  const ship = new Ship('cruiser', 3)

  expect(ship.hit()).not.toBeTruthy()
  expect(ship.hit()).not.toBeTruthy()
  expect(ship.hit()).toBeTruthy()

  expect(ship.hasSunk).toBeTruthy()

  // hasSunk should not change if hit even after it has been sunk
  expect(ship.hit()).toBeTruthy()
  expect(ship.hasSunk).toBeTruthy()
})
