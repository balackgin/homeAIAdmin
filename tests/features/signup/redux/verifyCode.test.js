import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  SIGNUP_VERIFY_CODE_BEGIN,
  SIGNUP_VERIFY_CODE_SUCCESS,
  SIGNUP_VERIFY_CODE_FAILURE,
  SIGNUP_VERIFY_CODE_DISMISS_ERROR,
} from 'src/features/signup/redux/constants';

import {
  verifyCode,
  dismissVerifyCodeError,
  doVerifyCode,
  reducer,
} from 'src/features/signup/redux/verifyCode';

describe('signup/redux/verifyCode', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by verifyCode', () => {
    expect(verifyCode()).to.have.property('type', SIGNUP_VERIFY_CODE_BEGIN);
  });

  it('returns correct action by dismissVerifyCodeError', () => {
    expect(dismissVerifyCodeError()).to.have.property('type', SIGNUP_VERIFY_CODE_DISMISS_ERROR);
  });

  // saga tests
  const generator = doVerifyCode();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches SIGNUP_VERIFY_CODE_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: SIGNUP_VERIFY_CODE_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches SIGNUP_VERIFY_CODE_FAILURE action when failed', () => {
    const generatorForError = doVerifyCode();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: SIGNUP_VERIFY_CODE_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type SIGNUP_VERIFY_CODE_BEGIN correctly', () => {
    const prevState = { verifyCodePending: false };
    const state = reducer(
      prevState,
      { type: SIGNUP_VERIFY_CODE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.verifyCodePending).to.be.true;
  });

  it('handles action type SIGNUP_VERIFY_CODE_SUCCESS correctly', () => {
    const prevState = { verifyCodePending: true };
    const state = reducer(
      prevState,
      { type: SIGNUP_VERIFY_CODE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.verifyCodePending).to.be.false;
  });

  it('handles action type SIGNUP_VERIFY_CODE_FAILURE correctly', () => {
    const prevState = { verifyCodePending: true };
    const state = reducer(
      prevState,
      { type: SIGNUP_VERIFY_CODE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.verifyCodePending).to.be.false;
    expect(state.verifyCodeError).to.exist;
  });

  it('handles action type SIGNUP_VERIFY_CODE_DISMISS_ERROR correctly', () => {
    const prevState = { verifyCodeError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SIGNUP_VERIFY_CODE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.verifyCodeError).to.be.null;
  });
});