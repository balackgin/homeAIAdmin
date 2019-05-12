import {
  SAMPLES_SAVE_CASE,
} from '../../../../src/features/samples/redux/constants';

import {
  saveCase,
  reducer,
} from '../../../../src/features/samples/redux/saveCase';

describe('samples/redux/saveCase', () => {
  it('returns correct action by saveCase', () => {
    expect(saveCase()).toHaveProperty('type', SAMPLES_SAVE_CASE);
  });

  it('handles action type SAMPLES_SAVE_CASE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: SAMPLES_SAVE_CASE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
