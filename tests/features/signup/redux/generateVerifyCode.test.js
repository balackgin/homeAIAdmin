import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  SIGNUP_GENERATE_VERIFY_CODE_BEGIN,
  SIGNUP_GENERATE_VERIFY_CODE_SUCCESS,
  SIGNUP_GENERATE_VERIFY_CODE_FAILURE,
  SIGNUP_GENERATE_VERIFY_CODE_DISMISS_ERROR,
} from 'src/features/signup/redux/constants';

import {
  generateVerifyCode,
  dismissGenerateVerifyCodeError,
  doGenerateVerifyCode,
  reducer,
} from 'src/features/signup/redux/generateVerifyCode';

describe('signup/redux/generateVerifyCode', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by verify', () => {
    expect(generateVerifyCode()).to.have.property('type', SIGNUP_GENERATE_VERIFY_CODE_BEGIN);
  });

  it('returns correct action by dismissGenerateVerifyCodeError', () => {
    expect(dismissGenerateVerifyCodeError()).to.have.property('type', SIGNUP_GENERATE_VERIFY_CODE_DISMISS_ERROR);
  });

  // saga tests
  const generator = doGenerateVerifyCode();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches SIGNUP_VERIFY_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: SIGNUP_GENERATE_VERIFY_CODE_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches SIGNUP_VERIFY_FAILURE action when failed', () => {
    const generatorForError = doGenerateVerifyCode();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: SIGNUP_GENERATE_VERIFY_CODE_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type SIGNUP_GENERATE_VERIFY_CODE_BEGIN correctly', () => {
    const prevState = { verifyPending: false };
    const state = reducer(
      prevState,
      { type: SIGNUP_GENERATE_VERIFY_CODE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.verifyPending).to.be.true;
  });

  it('handles action type SIGNUP_GENERATE_VERIFY_CODE_SUCCESS correctly', () => {
    const prevState = { verifyPending: true };
    const state = reducer(
      prevState,
      { type: SIGNUP_GENERATE_VERIFY_CODE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.verifyPending).to.be.false;
  });

  it('handles action type SIGNUP_GENERATE_VERIFY_CODE_FAILURE correctly', () => {
    const prevState = { verifyPending: true };
    const state = reducer(
      prevState,
      { type: SIGNUP_GENERATE_VERIFY_CODE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.verifyPending).to.be.false;
    expect(state.verifyError).to.exist;
  });

  it('handles action type SIGNUP_GENERATE_VERIFY_CODE_DISMISS_ERROR correctly', () => {
    const prevState = { verifyError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SIGNUP_GENERATE_VERIFY_CODE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.verifyError).to.be.null;
  });
});