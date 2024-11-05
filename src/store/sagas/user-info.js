import { all, put, takeLatest, call } from 'redux-saga/effects';
import * as Actions from '../actions';
import service from '../service';
import requestManagement from '../service/request-management';
import _ from 'lodash';

const { getIdToken, method_GET } = requestManagement;

export function* getUserInfo() {
  try {
    const token = yield call(getIdToken);
    const response = yield method_GET({
      url: `${service.profile}`,
      token,
    });

    const { data } = response;
    yield put(Actions.fetchUserInfoSuccess(data));
  } catch (error) {
    console.error('getUserInfo error: ', error);
  }
}

export function* getUserLeaderBoard() {
  try {
    const token = yield call(getIdToken);
    const response = yield method_GET({
      url: `${service.profile}/leader-board`,
      token,
    });

    const { data } = response;
    yield put(Actions.fetchUserLeaderBoardSuccess(data));
  } catch (error) {
    console.error('getUserLeaderBoard error: ', error);
  }
}

export function* watchUserInfo() {
  console.log('[sagas] watchUserInfo : ✅');
  yield all([
    takeLatest(Actions.fetchUserInfo, getUserInfo),
    takeLatest(Actions.fetchUserLeaderBoard, getUserLeaderBoard),
  ]);
}
