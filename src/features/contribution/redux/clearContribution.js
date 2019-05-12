// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  CONTRIBUTION_CLEAR_CONTRIBUTION,
} from './constants';

export function clearContribution() {
  return {
    type: CONTRIBUTION_CLEAR_CONTRIBUTION,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CONTRIBUTION_CLEAR_CONTRIBUTION:
      return {
        ...state,
        sampleList: [],
        statusTotalCount: {
          total: 0,
          CHECKED: 0,
          UNCHECKED: 0,
          ONLINE: 0,
          REFUSED: 0,
          OFFLINE: 0,
          RECALLED: 0,
        },
        totalCount: 0,
        currentPage: 1,
        currentTag: 'total',
        keyword: '',
      };

    default:
      return state;
  }
}
