// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  CASES_CLEAR_QUOTATION,
} from './constants';

export function clearQuotation() {
  return {
    type: CASES_CLEAR_QUOTATION,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CASES_CLEAR_QUOTATION:
      return {
        ...state,
        quotation: {},
        quotationType: 'dard_loading', // 将报价单页面的状态置为初始化状态
      };

    default:
      return state;
  }
}
