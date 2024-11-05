import { createActions } from 'redux-actions';

export const {
  fetchGameScoreUpdate,
  fetchGameScoreUpdateSuccess,
} = createActions({
  FETCH_GAME_SCORE_UPDATE: (req) => ({ req }),
  FETCH_GAME_SCORE_UPDATE_SUCCESS: (res) => ({ res }),
});
