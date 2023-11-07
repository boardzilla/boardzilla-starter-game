import {
  createGame,
  Player,
  playerActions,
  whileLoop,
  eachPlayer,
  boardClasses,
} from '@boardzilla/core';

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

Token.hide('name', 'color');

export default createGame({
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
    pool.createMany(board.gameSetting('tokens') - 1, Token, 'blue', { color: 'blue' });
    pool.create(Token, 'red', { color: 'red' });
    pool.shuffle();
  },

  actions: (board, action, player) => ({
    take: action({
      prompt: 'Choose a token',
    }).move({
      choosePiece: board.first('pool')!.all(Token),
      into: board.first('mat', {mine: true})
    }).message(
      token => `${player} drew a ${token} token.`
    )
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
  })
});
