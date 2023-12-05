import {
  createGame,
  createBoardClasses,
  Player,
  Board,
  playerActions,
  loop,
  eachPlayer,
} from '@boardzilla/core';

export class MyGamePlayer extends Player<MyGamePlayer, MyGameBoard> {
  /**
   * Any properties of your players that are specific to your game go here
   */
  score: number = 0;
};

class MyGameBoard extends Board<MyGamePlayer, MyGameBoard> {
  /**
   * Any overall properties of your game go here
   */
  phase: number = 1;
}

const { Space, Piece } = createBoardClasses<MyGamePlayer, MyGameBoard>();

export { Space };

/**
 * Define your game's custom pieces and spaces.
 */

export class Token extends Piece {
  color: 'red' | 'blue';
}

Token.hide('name', 'color');

export default createGame(MyGamePlayer, MyGameBoard, game => {

  const { board, action } = game;

  /**
   * Register all custom pieces and spaces
   */
  board.registerClasses(Token);

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

  game.defineActions({
    take: () => action({
      prompt: 'Choose a token',
    }).move(
      'token', pool.all(Token),
      'mat', board.first('mat', {mine: true})
    ).message(
      `{{player}} drew a {{token}} token.`
    )
  });

  game.defineFlow(
    loop(
      eachPlayer({
        name: 'player',
        do: playerActions({
          actions: [{
            name: 'take',
            do: ({ player }) => {
              if (board.first('mat', {mine: true})!.first(Token, {color: 'red'})) {
                game.message("{{player}} wins!", { player });
                game.finish(player);
              }
            }
          }]
        })
      })
    )
  );
});
