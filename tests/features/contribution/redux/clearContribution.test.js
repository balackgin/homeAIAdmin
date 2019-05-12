import {
  CONTRIBUTION_CLEAR_CONTRIBUTION,
} from '../../../../src/features/contribution/redux/constants';

import {
  clearContribution,
  reducer,
} from '../../../../src/features/contribution/redux/clearContribution';

describe('contribution/redux/clearContribution', () => {
  it('returns correct action by clearContribution', () => {
    expect(clearContribution()).toHaveProperty('type', CONTRIBUTION_CLEAR_CONTRIBUTION);
  });

  it('handles action type CONTRIBUTION_CLEAR_CONTRIBUTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: CONTRIBUTION_CLEAR_CONTRIBUTION }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
