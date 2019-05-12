// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  CASES_CLEAR_EDIT_DATA,
} from './constants';

export function clearEditData() {
  return {
    type: CASES_CLEAR_EDIT_DATA,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CASES_CLEAR_EDIT_DATA:
      return {
        ...state,
        cover: '',
        guideMap: [],
        customTags: [],
      };

    default:
      return state;
  }
}
