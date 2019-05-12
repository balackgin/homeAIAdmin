// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  SAMPLES_SAVE_ROOM_LIST,
} from './constants';

export function saveRoomList(roomList) {
  return {
    type: SAMPLES_SAVE_ROOM_LIST,
    payload: roomList
  };
}

export function reducer(state, { type, payload }) {
  switch (type) {
    case SAMPLES_SAVE_ROOM_LIST:
      return {
        ...state,
        roomList: payload
      };

    default:
      return state;
  }
}
