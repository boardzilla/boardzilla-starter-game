import {
  createGame,
  createBoardClass,
  createBoardClasses,
  Player,
  playerActions,
  whileLoop,
  eachPlayer,
} from '@boardzilla/core';

export class MyGamePlayer extends Player {
  score: number = 0;
};

const Board = createBoardClass(MyGamePlayer);

class MyGameBoard extends Board {
  phase: number = 1;
}

const { Space, Piece } = createBoardClasses(MyGameBoard);

export { Space };

export class Token extends Piece {
  color: 'red' | 'blue';
}

Token.hide('name', 'color');

export default createGame(MyGamePlayer, MyGameBoard, [Token], board => {

  const action = board.action;

  for (const player of board.players) {
    const mat = board.create(Space, 'mat', { player });
    mat.onEnter(Token, t => t.showToAll());
  }

  const pool = board.create(Space, 'pool');
  pool.onEnter(Token, t => t.hideFromAll());
  pool.createMany(board.gameSetting('tokens') - 1, Token, 'blue', { color: 'blue' });
  pool.create(Token, 'red', { color: 'red' });
  pool.shuffle();

  board.defineActions({
    take: () => action({
      prompt: 'Choose a token',
    }).move(
      'token', board.first('pool')!.all(Token),
      'mat', board.first('mat', {mine: true})
    ).message(
      `{{player}} drew a {{token}} token.`
    )
  });

  board.defineFlow(() => (
    whileLoop({
      while: () => true,
      do: eachPlayer({
        name: 'player',
        do: playerActions({
          actions: {
            take: ({ player }) => {
              if (board.first('mat', {mine: true})!.first(Token, {color: 'red'})) {
                board.message("{{player}} wins!", { player });
                board.finish(player);
              }
            }
          }
        })
      })
    })
  ));
});
