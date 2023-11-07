import setup from './index.js';
import { createInteface } from '@boardzilla/core';

const { initialState, processMove, getPlayerState } = createInteface(setup)
export { initialState, processMove, getPlayerState };
