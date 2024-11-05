import { handleActions } from 'redux-actions';
import * as Actions from '../actions';

const defaultState = {
  userInfoLoading: false,
  userData: {},
  userLeaderBoard: [],
};

export const reducer = handleActions(
  {
    [Actions.fetchUserInfo]: (state, { payload: { req } }) => ({
      ...state,
      userData: {},
      userInfoLoading: true,
    }),
    [Actions.fetchUserInfoSuccess]: (state, { payload: { res } }) => ({
      ...state,
      userData: { ...state.userData, ...res },
      userInfoLoading: false,
    }),
    [Actions.fetchUserLeaderBoard]: (state, { payload: { req } }) => ({
      ...state,
      userLeaderBoard: [],
      userInfoLoading: true,
    }),
    [Actions.fetchUserLeaderBoardSuccess]: (state, { payload: { res } }) => ({
      ...state,
      userLeaderBoard: res,
      userInfoLoading: false,
    }),
  },
  defaultState,
);
