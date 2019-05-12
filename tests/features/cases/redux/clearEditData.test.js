import {
  CASES_CLEAR_EDIT_DATA,
} from '../../../../src/features/cases/redux/constants';

import {
  clearEditData,
  reducer,
} from '../../../../src/features/cases/redux/clearEditData';

describe('cases/redux/clearEditData', () => {
  it('returns correct action by clearEditData', () => {
    expect(clearEditData()).toHaveProperty('type', CASES_CLEAR_EDIT_DATA);
  });

  it('handles action type CASES_CLEAR_EDIT_DATA correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: CASES_CLEAR_EDIT_DATA }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
