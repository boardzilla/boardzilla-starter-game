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
  /**
   * Any properties of your players that are specific to your game go here
   */
  score: number = 0;
};

const Board = createBoardClass(MyGamePlayer);

class MyGameBoard extends Board {
  /**
   * Any overall properties of your game go here
   */
  phase: number = 1;
}

const { Space, Piece } = createBoardClasses(MyGameBoard);

export { Space };

/**
 * Define your game's custom pieces and spaces.
 */

export class Token extends Piece {
  color: 'red' | 'blue';
}

Token.hide('name', 'color');

export default createGame(MyGamePlayer, MyGameBoard, board => {

  /**
   * Register all custom pieces and spaces
   */
  board.registerClasses(Token);

  const action = board.action;

  /**
   * Setup your game board. If you capture your board spaces in variables here,
   * they are always usable in the action/flow logic below. Pieces cannot be
   * captured and reused since they move around their identities are kept
   * anonymous.
   */
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
      'token', pool.all(Token),
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
