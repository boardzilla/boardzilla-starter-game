import { expect, test, beforeEach } from 'vitest'
import { TestRunner } from "@boardzilla/core";
import { Token, default as setup } from '../src/game/index.js';

let runner: TestRunner

beforeEach(() => {
  runner = new TestRunner(setup);
})

test('allows you to take turns', () => {
  runner.start({
    players: 2,
    settings: { tokens: 4 }
  });

  expect(runner.availableActions(1)).toStrictEqual(['take'])
  expect(runner.availableActions(2)).toStrictEqual([])

  runner.move(1, 'take', {
    token: runner.players[0].board.first('pool')!.last(Token)!
  });

  expect(runner.availableActions(1)).toStrictEqual([])
  expect(runner.availableActions(2)).toStrictEqual(['take'])

  runner.move(2, 'take', {
    token: runner.players[1].board.first('pool')!.first(Token)!
  });

  expect(runner.server.game().phase).toBe('finished')
})

test("doesn't allow one player to play twice", () => {
  runner.start({
    players: 2,
    settings: { tokens: 4 }
  });

  expect(runner.availableActions(1)).toStrictEqual(['take'])
  expect(runner.availableActions(2)).toStrictEqual([])

  runner.move(1, 'take', {
    token: runner.players[0].board.first('pool')!.last(Token)!
  });

  expect(runner.availableActions(1)).toStrictEqual([])

  expect(() => runner.move(1, 'take', {
    token: runner.players[0].board.first('pool')!.last(Token)!
  })).toThrowError()
})
