import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_FETCH_USER_INFO_BEGIN,
  HOME_FETCH_USER_INFO_SUCCESS,
  HOME_FETCH_USER_INFO_FAILURE,
  HOME_FETCH_USER_INFO_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  fetchUserInfo,
  dismissFetchUserInfoError,
  doFetchUserInfo,
  reducer,
} from 'src/features/home/redux/fetchUserInfo';

describe('home/redux/fetchUserInfo', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchUserInfo', () => {
    expect(fetchUserInfo()).to.have.property('type', HOME_FETCH_USER_INFO_BEGIN);
  });

  it('returns correct action by dismissFetchUserInfoError', () => {
    expect(dismissFetchUserInfoError()).to.have.property('type', HOME_FETCH_USER_INFO_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchUserInfo();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches HOME_FETCH_USER_INFO_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: HOME_FETCH_USER_INFO_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches HOME_FETCH_USER_INFO_FAILURE action when failed', () => {
    const generatorForError = doFetchUserInfo();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: HOME_FETCH_USER_INFO_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type HOME_FETCH_USER_INFO_BEGIN correctly', () => {
    const prevState = { fetchUserInfoPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_USER_INFO_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchUserInfoPending).to.be.true;
  });

  it('handles action type HOME_FETCH_USER_INFO_SUCCESS correctly', () => {
    const prevState = { fetchUserInfoPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_USER_INFO_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchUserInfoPending).to.be.false;
  });

  it('handles action type HOME_FETCH_USER_INFO_FAILURE correctly', () => {
    const prevState = { fetchUserInfoPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_USER_INFO_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchUserInfoPending).to.be.false;
    expect(state.fetchUserInfoError).to.exist;
  });

  it('handles action type HOME_FETCH_USER_INFO_DISMISS_ERROR correctly', () => {
    const prevState = { fetchUserInfoError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_USER_INFO_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchUserInfoError).to.be.null;
  });
});