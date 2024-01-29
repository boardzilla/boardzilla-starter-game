import { expect, test, beforeEach } from 'vitest'
import { TestRunner } from "@boardzilla/core";
import { Token, default as setup } from '../src/game/index.js';

let runner: TestRunner<ReturnType<typeof setup>['players'][0], ReturnType<typeof setup>['board']>

beforeEach(() => {
  runner = new TestRunner(setup);
})

test('allows you to take turns', () => {
  const [player1, player2] = runner.start({
    players: 2,
    settings: { tokens: 4 }
  });

  expect(player1.actions()).toStrictEqual(['take'])
  expect(player2.actions()).toStrictEqual([])

  player1.move('take', {
    token: player1.board.first('pool')!.last(Token)!
  });

  expect(player1.actions()).toStrictEqual([])
  expect(player2.actions()).toStrictEqual(['take'])

  player2.move('take', {
    token: player2.board.first('pool')!.first(Token)!
  });

  expect(runner.server.game.phase).toBe('finished')
})

test("doesn't allow one player to play twice", () => {
  const [player1, player2] = runner.start({
    players: 2,
    settings: { tokens: 4 }
  });

  expect(player1.actions()).toStrictEqual(['take'])
  expect(player2.actions()).toStrictEqual([])

  player1.move('take', {
    token: player1.board.first('pool')!.last(Token)!
  });

  expect(() => player1.move('take', {
    token: player1.board.first('pool')!.last(Token)!
  })).toThrowError()
})
