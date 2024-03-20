import {
  createGame,
  Player,
  Game,
  Space,
  Piece,
} from '@boardzilla/core';

export class MyGamePlayer extends Player<MyGame, MyGamePlayer> {
  /**
   * Any properties of your players that are specific to your game go here
   */
  score: number = 0; // as an example
};

export class MyGame extends Game<MyGame, MyGamePlayer> {
  /**
   * Any overall properties of your game go here
   */
  phase: number = 1; // as an example
}

/**
 * Define your game's custom pieces and spaces.
 */
export class Token extends Piece<MyGame> { // as an example
  color: 'red' | 'blue';
}

export default createGame(MyGamePlayer, MyGame, game => {

  const { action } = game;
  const { playerActions, loop, eachPlayer } = game.flowCommands;

  /**
   * Create your game's layout and all included pieces, e.g.:
   */
  for (const player of game.players) {
    const mat = game.create(Space, 'mat', { player });
    mat.onEnter(Token, t => t.showToAll());
  }

  game.create(Space, 'pool');
  $.pool.onEnter(Token, t => t.hideFromAll());
  $.pool.createMany(game.setting('tokens') - 1, Token, 'blue', { color: 'blue' });
  $.pool.create(Token, 'red', { color: 'red' });

  /**
   * Define all possible game actions, e.g.:
   */
  game.defineActions({
    take: player => action({
      prompt: 'Choose a token',
    }).chooseOnBoard(
      'token', $.pool.all(Token),
    ).move(
      'token', player.my('mat')!
    ).message(
      `{{player}} drew a {{token}} token.`
    ).do(({ token }) => {
      if (token.color === 'red') {
        game.message("{{player}} wins!", { player });
        game.finish(player);
      }
    }),
  });

  /**
   * Define the game flow, starting with board setup and progressing through all
   * phases and turns, e.g.:
   */
  game.defineFlow(
    () => $.pool.shuffle(),
    loop(
      eachPlayer({
        name: 'player',
        do: playerActions({
          actions: ['take']
        }),
      })
    )
  );
});
