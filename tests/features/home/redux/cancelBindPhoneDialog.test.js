import {
  HOME_CANCEL_BIND_PHONE_DIALOG,
} from '../../../../src/features/home/redux/constants';

import {
  cancelBindPhoneDialog,
  reducer,
} from '../../../../src/features/home/redux/cancelBindPhoneDialog';

describe('home/redux/cancelBindPhoneDialog', () => {
  it('returns correct action by cancelBindPhoneDialog', () => {
    expect(cancelBindPhoneDialog()).toHaveProperty('type', HOME_CANCEL_BIND_PHONE_DIALOG);
  });

  it('handles action type HOME_CANCEL_BIND_PHONE_DIALOG correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_CANCEL_BIND_PHONE_DIALOG }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
