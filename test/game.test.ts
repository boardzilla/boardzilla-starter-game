import { expect, test, beforeEach } from 'vitest'
import { TestRunner } from "@boardzilla/core";
import setup, { MyGame, Token } from '../src/game/index.js';

let runner: TestRunner<MyGame>;

beforeEach(() => {
  runner = new TestRunner(setup);
})

test('allows you to take turns', () => {
  const [ui1, ui2] = runner.start({
    players: 2,
    settings: { tokens: 4 }
  });

  expect(ui1.actions()).toStrictEqual(['take'])
  expect(ui2.actions()).toStrictEqual([])

  ui1.move('take', {
    token: ui1.game.first('pool')!.last(Token)!
  });

  expect(ui1.actions()).toStrictEqual([])
  expect(ui2.actions()).toStrictEqual(['take'])

  ui2.move('take', {
    token: ui2.game.first('pool')!.first(Token)!
  });

  expect(ui2.game.getWinners()).toStrictEqual([ui2.player])
})

test("doesn't allow one player to play twice", () => {
  const [ui1, ui2] = runner.start({
    players: 2,
    settings: { tokens: 4 }
  });

  expect(ui1.actions()).toStrictEqual(['take'])
  expect(ui2.actions()).toStrictEqual([])

  ui1.move('take', {
    token: ui1.game.first('pool')!.last(Token)!
  });

  expect(() => ui1.move('take', {
    token: ui1.game.first('pool')!.last(Token)!
  })).toThrowError()
})
