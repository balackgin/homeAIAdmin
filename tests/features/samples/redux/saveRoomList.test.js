import {
  SAMPLES_SAVE_ROOM_LIST,
} from '../../../../src/features/samples/redux/constants';

import {
  saveRoomList,
  reducer,
} from '../../../../src/features/samples/redux/saveRoomList';

describe('samples/redux/saveRoomList', () => {
  it('returns correct action by saveRoomList', () => {
    expect(saveRoomList()).toHaveProperty('type', SAMPLES_SAVE_ROOM_LIST);
  });

  it('handles action type SAMPLES_SAVE_ROOM_LIST correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: SAMPLES_SAVE_ROOM_LIST }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
