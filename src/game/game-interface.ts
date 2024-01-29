import setup from './index.js';
import { createInterface } from '@boardzilla/core';

const { initialState, processMove, getPlayerState } = createInterface(setup)
export { initialState, processMove, getPlayerState };
