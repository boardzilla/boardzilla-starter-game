import { TestRunner } from "@boardzilla/core";
import { Token, default as setup } from './game/index.js';

const runner = new TestRunner(setup);

runner.start({
  players: 2,
  settings: { tokens: 4 }
});

let p1Actions = runner.availableActions(1);
let p2Actions = runner.availableActions(2);

console.assert(p1Actions[0] === 'take');
console.assert(p1Actions.length === 1);
console.assert(p2Actions.length === 0);

runner.move(1, 'take', {
  token: runner.players[0].board.first('pool')!.last(Token)!
});

p1Actions = runner.availableActions(1);
p2Actions = runner.availableActions(2);

console.assert(p2Actions[0] === 'take');
console.assert(p2Actions.length === 1);
console.assert(p1Actions.length === 0);

runner.move(2, 'take', {
  token: runner.players[1].board.first('pool')!.first(Token)!
});

console.assert(runner.server.game().phase === 'finished');
