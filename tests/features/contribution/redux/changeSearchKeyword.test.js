import {
  CONTRIBUTION_CHANGE_SEARCH_KEYWORD,
} from '../../../../src/features/contribution/redux/constants';

import {
  changeSearchKeyword,
  reducer,
} from '../../../../src/features/contribution/redux/changeSearchKeyword';

describe('contribution/redux/changeSearchKeyword', () => {
  it('returns correct action by changeSearchKeyword', () => {
    expect(changeSearchKeyword()).toHaveProperty('type', CONTRIBUTION_CHANGE_SEARCH_KEYWORD);
  });

  it('handles action type CONTRIBUTION_CHANGE_SEARCH_KEYWORD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: CONTRIBUTION_CHANGE_SEARCH_KEYWORD }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
