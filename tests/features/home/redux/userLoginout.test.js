import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_USER_LOGINOUT_BEGIN,
  HOME_USER_LOGINOUT_SUCCESS,
  HOME_USER_LOGINOUT_FAILURE,
  HOME_USER_LOGINOUT_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  userLoginout,
  dismissUserLoginoutError,
  doUserLoginout,
  reducer,
} from 'src/features/home/redux/userLoginout';

describe('home/redux/userLoginout', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by userLoginout', () => {
    expect(userLoginout()).to.have.property('type', HOME_USER_LOGINOUT_BEGIN);
  });

  it('returns correct action by dismissUserLoginoutError', () => {
    expect(dismissUserLoginoutError()).to.have.property('type', HOME_USER_LOGINOUT_DISMISS_ERROR);
  });

  // saga tests
  const generator = doUserLoginout();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches HOME_USER_LOGINOUT_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: HOME_USER_LOGINOUT_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches HOME_USER_LOGINOUT_FAILURE action when failed', () => {
    const generatorForError = doUserLoginout();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: HOME_USER_LOGINOUT_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type HOME_USER_LOGINOUT_BEGIN correctly', () => {
    const prevState = { userLoginoutPending: false };
    const state = reducer(
      prevState,
      { type: HOME_USER_LOGINOUT_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.userLoginoutPending).to.be.true;
  });

  it('handles action type HOME_USER_LOGINOUT_SUCCESS correctly', () => {
    const prevState = { userLoginoutPending: true };
    const state = reducer(
      prevState,
      { type: HOME_USER_LOGINOUT_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.userLoginoutPending).to.be.false;
  });

  it('handles action type HOME_USER_LOGINOUT_FAILURE correctly', () => {
    const prevState = { userLoginoutPending: true };
    const state = reducer(
      prevState,
      { type: HOME_USER_LOGINOUT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.userLoginoutPending).to.be.false;
    expect(state.userLoginoutError).to.exist;
  });

  it('handles action type HOME_USER_LOGINOUT_DISMISS_ERROR correctly', () => {
    const prevState = { userLoginoutError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_USER_LOGINOUT_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.userLoginoutError).to.be.null;
  });
});