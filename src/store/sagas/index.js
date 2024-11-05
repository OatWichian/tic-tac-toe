import { all } from 'redux-saga/effects';
import { watchUserInfo } from './user-info';
import { watchGame } from './game';

export default function* rootSaga() {
  try {
    yield all([
      watchUserInfo(),
      watchGame(),
    ]);
  } catch (error) {
    console.error(error);
  }
}
