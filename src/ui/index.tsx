import render, { numberSetting } from '@boardzilla/core/ui';

import setup from '../game/index';

import './style.scss';

render(setup, {
  settings: {
    tokens: numberSetting('a number', 4, 24),
  },
});
