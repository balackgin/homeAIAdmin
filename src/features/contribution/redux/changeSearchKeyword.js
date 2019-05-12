// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  CONTRIBUTION_CHANGE_SEARCH_KEYWORD,
} from './constants';

export function changeSearchKeyword(keyword) {
  return {
    type: CONTRIBUTION_CHANGE_SEARCH_KEYWORD,
    keyword,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CONTRIBUTION_CHANGE_SEARCH_KEYWORD:
      return {
        ...state,
        keyword: action.keyword,
      };

    default:
      return state;
  }
}
