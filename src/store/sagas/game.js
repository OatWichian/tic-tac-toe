import { all, put, takeLatest, call } from 'redux-saga/effects';
import * as Actions from '../actions';
import service from '../service';
import requestManagement from '../service/request-management';
import _ from 'lodash';

const { getIdToken, method_POST } = requestManagement;

export function* updateGameScore({ payload }) {
  try {
    const token = yield call(getIdToken);
    const response = yield method_POST({
      url: `${service.game}/score`,
      token,
      data: {
        ...payload?.req,
      },
    });

    const { data } = response;
    yield put(Actions.fetchGameScoreUpdateSuccess(data));
  } catch (error) {
    console.error('updateGameScore error: ', error);
  }
}

export function* watchGame() {
  console.log('[sagas] watchGame : ✅');
  yield all([takeLatest(Actions.fetchGameScoreUpdate, updateGameScore)]);
}
