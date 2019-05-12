import { takeEvery, put } from 'redux-saga/effects';

let msgId = 0;

function* handleMessages(action) {
  msgId++;
  yield put({
    type: 'MSG',
    payload:{
      message: {
        id: msgId, 
        ...action.payload      
      }
    },
  });
}

export default function* message() {
  yield takeEvery('SHOW_MSG', handleMessages);
}
