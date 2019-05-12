// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  SETTINGS_CHANGE_TO_EDIT_STATUS,
} from './constants';

export function changeToEditStatus() {
  return {
    type: SETTINGS_CHANGE_TO_EDIT_STATUS
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case SETTINGS_CHANGE_TO_EDIT_STATUS:
      return {
        ...state,
        editStatus: !state.editStatus
      };

    default:
      return state;
  }
}
