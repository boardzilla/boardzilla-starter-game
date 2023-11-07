import React from 'react';
import { render, numberSetting, boardClasses } from '@boardzilla/core';
import { default as setup, MyGamePlayer, Token } from '../game/index.js';

import './style.scss';

render(setup, {
  settings: {
    tokens: numberSetting('a number', 4, 24),
  },
  layout: board => {

    const { Space } = boardClasses(MyGamePlayer);

    board.appearance({
      render: () => null
    });

    board.all(Token).appearance({
      aspectRatio: 1,
      render: () => (
        <div className="flipper">
          <div className="front"></div>
          <div className="back"></div>
        </div>
      )
    });

    board.layout(Space, {
      gap: 1,
      margin: 1
    });

    board.all(Space).layout(Token, {
      gap: 1,
    });
  }
});
