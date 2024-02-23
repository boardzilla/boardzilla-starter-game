import React from 'react';
import { render, numberSetting } from '@boardzilla/core';
import { default as setup, Space, Token } from '../game/index.js';

import './style.scss';
import '@boardzilla/core/index.css';

render(setup, {
  settings: {
    tokens: numberSetting('Number of tokens', 4, 24),
  },
  layout: game => {
    game.appearance({
      render: () => null
    });

    game.all(Token).appearance({
      aspectRatio: 1,
      render: () => (
        <div className="flipper">
          <div className="front"></div>
          <div className="back"></div>
        </div>
      )
    });

    game.layout(Space, {
      gap: 1,
      margin: 1
    });

    game.all(Space).layout(Token, {
      gap: 1,
      margin: 1
    });
  }
});
