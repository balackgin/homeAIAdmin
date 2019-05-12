import {
  CASES_CLEAR_QUOTATION,
} from '../../../../src/features/cases/redux/constants';

import {
  clearQuotation,
  reducer,
} from '../../../../src/features/cases/redux/clearQuotation';

describe('cases/redux/clearQuotation', () => {
  it('returns correct action by clearQuotation', () => {
    expect(clearQuotation()).toHaveProperty('type', CASES_CLEAR_QUOTATION);
  });

  it('handles action type CASES_CLEAR_QUOTATION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: CASES_CLEAR_QUOTATION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
