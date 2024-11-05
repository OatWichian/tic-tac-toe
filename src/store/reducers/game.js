import { handleActions } from 'redux-actions';
import * as Actions from '../actions';

const defaultState = {
  gameScoreIndividual: {},
  gameScoreLoading: false,
};

export const reducer = handleActions(
  {
    [Actions.fetchGameScoreUpdate]: (state, { payload: { req } }) => ({
      ...state,
      gameScoreIndividual: {},
      gameScoreLoading: true,
    }),
    [Actions.fetchGameScoreUpdateSuccess]: (state, { payload: { res } }) => ({
      ...state,
      gameScoreIndividual: res,
      gameScoreLoading: false,
    }),
  },
  defaultState,
);
