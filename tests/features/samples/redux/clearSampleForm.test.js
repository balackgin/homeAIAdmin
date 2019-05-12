import {
  SAMPLES_CLEAR_SAMPLE_FORM,
} from '../../../../src/features/samples/redux/constants';

import {
  clearSampleForm,
  reducer,
} from '../../../../src/features/samples/redux/clearSampleForm';

describe('samples/redux/clearSampleForm', () => {
  it('returns correct action by clearSampleForm', () => {
    expect(clearSampleForm()).toHaveProperty('type', SAMPLES_CLEAR_SAMPLE_FORM);
  });

  it('handles action type SAMPLES_CLEAR_SAMPLE_FORM correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: SAMPLES_CLEAR_SAMPLE_FORM }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
