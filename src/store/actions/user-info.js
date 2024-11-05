import { createActions } from 'redux-actions';

export const {
  fetchUserInfo,
  fetchUserInfoSuccess,
  fetchUserLeaderBoard,
  fetchUserLeaderBoardSuccess,
} = createActions({
  FETCH_USER_INFO: (req) => ({ req }),
  FETCH_USER_INFO_SUCCESS: (res) => ({ res }),
  FETCH_USER_LEADER_BOARD: (req) => ({ req }),
  FETCH_USER_LEADER_BOARD_SUCCESS: (res) => ({ res }),
});
