import {
  SAMPLES_SET_STEP,
} from '../../../../src/features/samples/redux/constants';

import {
  setStep,
  reducer,
} from '../../../../src/features/samples/redux/setStep';

describe('samples/redux/setStep', () => {
  it('returns correct action by setStep', () => {
    expect(setStep()).toHaveProperty('type', SAMPLES_SET_STEP);
  });

  it('handles action type SAMPLES_SET_STEP correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: SAMPLES_SET_STEP }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
