import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  SETTINGS_SAVE_USER_INFO_BEGIN,
  SETTINGS_SAVE_USER_INFO_SUCCESS,
  SETTINGS_SAVE_USER_INFO_FAILURE,
  SETTINGS_SAVE_USER_INFO_DISMISS_ERROR,
} from 'src/features/settings/redux/constants';

import {
  saveUserInfo,
  dismissSaveUserInfoError,
  doSaveUserInfo,
  reducer,
} from 'src/features/settings/redux/saveUserInfo';

describe('settings/redux/saveUserInfo', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by saveUserInfo', () => {
    expect(saveUserInfo()).to.have.property('type', SETTINGS_SAVE_USER_INFO_BEGIN);
  });

  it('returns correct action by dismissSaveUserInfoError', () => {
    expect(dismissSaveUserInfoError()).to.have.property('type', SETTINGS_SAVE_USER_INFO_DISMISS_ERROR);
  });

  // saga tests
  const generator = doSaveUserInfo();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches SETTINGS_SAVE_USER_INFO_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: SETTINGS_SAVE_USER_INFO_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches SETTINGS_SAVE_USER_INFO_FAILURE action when failed', () => {
    const generatorForError = doSaveUserInfo();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: SETTINGS_SAVE_USER_INFO_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type SETTINGS_SAVE_USER_INFO_BEGIN correctly', () => {
    const prevState = { saveUserInfoPending: false };
    const state = reducer(
      prevState,
      { type: SETTINGS_SAVE_USER_INFO_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveUserInfoPending).to.be.true;
  });

  it('handles action type SETTINGS_SAVE_USER_INFO_SUCCESS correctly', () => {
    const prevState = { saveUserInfoPending: true };
    const state = reducer(
      prevState,
      { type: SETTINGS_SAVE_USER_INFO_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveUserInfoPending).to.be.false;
  });

  it('handles action type SETTINGS_SAVE_USER_INFO_FAILURE correctly', () => {
    const prevState = { saveUserInfoPending: true };
    const state = reducer(
      prevState,
      { type: SETTINGS_SAVE_USER_INFO_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveUserInfoPending).to.be.false;
    expect(state.saveUserInfoError).to.exist;
  });

  it('handles action type SETTINGS_SAVE_USER_INFO_DISMISS_ERROR correctly', () => {
    const prevState = { saveUserInfoError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SETTINGS_SAVE_USER_INFO_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveUserInfoError).to.be.null;
  });
});