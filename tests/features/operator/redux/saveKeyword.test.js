import {
  OPERATOR_SAVE_KEYWORD,
} from '../../../../src/features/operator/redux/constants';

import {
  saveKeyword,
  reducer,
} from '../../../../src/features/operator/redux/saveKeyword';

describe('operator/redux/saveKeyword', () => {
  it('returns correct action by saveKeyword', () => {
    expect(saveKeyword()).toHaveProperty('type', OPERATOR_SAVE_KEYWORD);
  });

  it('handles action type OPERATOR_SAVE_KEYWORD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: OPERATOR_SAVE_KEYWORD }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
