/* eslint-disable no-undef */
import { Player } from '../src/player.js'

test('Can place and hit a rotated ship', () => {
  const player = new Player(1)

  player.nextShipToPlace.changeDirection()
  expect(player.placeNextShipAt(0, 1)).toBeTruthy()

  expect(player.getsfiredAt(0, 1)).toBeTruthy()
  expect(player.getsfiredAt(1, 0)).toBeFalsy()
})

test('Cannot place ship at occupied coordinates', () => {
  const player = new Player(1)

  expect(player.placeNextShipAt(0, 0)).toBeTruthy()
  expect(player.placeNextShipAt(0, 0)).toBeFalsy()
})

test('Cannot place more than max ships', () => {
  const player = new Player(1)

  expect(player.placeNextShipAt(0, 0)).toBeTruthy()
  expect(player.placeNextShipAt(0, 1)).toBeTruthy()
  expect(player.placeNextShipAt(0, 2)).toBeTruthy()
  expect(player.placeNextShipAt(0, 3)).toBeTruthy()
  expect(player.placeNextShipAt(0, 4)).toBeTruthy()

  expect(player.hasShipsLeftToPlace).toBeFalsy()

  expect(player.placeNextShipAt(0, 5)).toBeFalsy()
})

test('Cannot place ship which sticks out of bounds', () => {
  const player = new Player(1)

  expect(player.placeNextShipAt(8, 0)).toBeFalsy()
  expect(player.placeNextShipAt(20, 20)).toBeFalsy()
})

test('Ships are alive at creation', () => {
  const player = new Player(1)

  expect(player.hasShipsLeft()).toBeTruthy()
})
