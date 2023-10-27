import React from 'react';

import setup, {
  Player,
  playerActions,
  whileLoop,
  eachPlayer,
  boardClasses,
} from '@boardzilla/core/game';

export class MyGamePlayer extends Player {
  score: number = 0;
};

const {
  Board,
  Space,
  Piece,
} = boardClasses(MyGamePlayer);

class MyGameBoard extends Board {
  phase: number = 1;
}

export class Token extends Piece {
  color: 'red' | 'blue';
}

Token.hiddenAttributes = ['name', 'color'];

export default setup({
  playerClass: MyGamePlayer,
  boardClass: MyGameBoard,
  elementClasses: [ Token ],
  setup: board => {
    for (const player of board.players) {
      const mat = board.create(Space, 'mat', { player });
      mat.onEnter(Token, t => t.showToAll());
    }
    const pool = board.create(Space, 'pool');
    pool.onEnter(Token, t => t.hideFromAll());
    pool.createMany(11, Token, 'blue', { color: 'blue' });
    pool.create(Token, 'red', { color: 'red' });
    pool.shuffle();
  },

  actions: (board, action, player) => ({
    take: action({
      prompt: 'Choose a token',
      message: "$player drew a $1 token.",
    }).move({
      choosePiece: board.first('pool')!.all(Token),
      into: board.first('mat', {mine: true})
    }),
  }),

  flow: board => whileLoop({
    while: () => true,
    do: eachPlayer({
      name: 'player',
      do: playerActions({
        actions: {
          take: () => {
            if (board.first('mat', {mine: true})!.first(Token, {color: 'red'})) {
              board.message("$1 wins!", board.players.current());
              board.finish(board.players.current());
            }
          }
        }
      })
    })
  }),
});
