import setup from './index';
import { createInteface } from '@boardzilla/core/game/utils';

const { initialState, processMove, getPlayerState } = createInteface(setup)
export { initialState, processMove, getPlayerState };
