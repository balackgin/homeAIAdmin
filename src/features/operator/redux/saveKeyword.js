// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  OPERATOR_SAVE_KEYWORD,
} from './constants';

export function saveKeyword(keyword) {
  return {
    type: OPERATOR_SAVE_KEYWORD,
    keyword
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case OPERATOR_SAVE_KEYWORD:
      const { keyword } = action;
      return {
        ...state,
        keyword
      };

    default:
      return state;
  }
}
