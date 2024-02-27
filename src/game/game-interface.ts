import setup from './index.js';
import { createInterface } from '@boardzilla/core';

const { initialState, processMove, seatPlayer } = createInterface(setup)
export { initialState, processMove, seatPlayer };
