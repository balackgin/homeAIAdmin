import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  SIGNUP_REGISTER_BEGIN,
  SIGNUP_REGISTER_SUCCESS,
  SIGNUP_REGISTER_FAILURE,
  SIGNUP_REGISTER_DISMISS_ERROR,
} from 'src/features/signup/redux/constants';

import {
  register,
  dismissRegisterError,
  doRegister,
  reducer,
} from 'src/features/signup/redux/register';

describe('signup/redux/register', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by signup', () => {
    expect(register()).to.have.property('type', SIGNUP_REGISTER_BEGIN);
  });

  it('returns correct action by dismissRegisterError', () => {
    expect(dismissRegisterError()).to.have.property('type', SIGNUP_REGISTER_DISMISS_ERROR);
  });

  // saga tests
  const generator = doRegister();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches SIGNUP_SIGNUP_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: SIGNUP_REGISTER_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches SIGNUP_SIGNUP_FAILURE action when failed', () => {
    const generatorForError = doRegister();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: SIGNUP_REGISTER_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type SIGNUP_REGISTER_BEGIN correctly', () => {
    const prevState = { signupPending: false };
    const state = reducer(
      prevState,
      { type: SIGNUP_REGISTER_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.signupPending).to.be.true;
  });

  it('handles action type SIGNUP_REGISTER_SUCCESS correctly', () => {
    const prevState = { signupPending: true };
    const state = reducer(
      prevState,
      { type: SIGNUP_REGISTER_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.signupPending).to.be.false;
  });

  it('handles action type SIGNUP_REGISTER_FAILURE correctly', () => {
    const prevState = { signupPending: true };
    const state = reducer(
      prevState,
      { type: SIGNUP_REGISTER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.signupPending).to.be.false;
    expect(state.signupError).to.exist;
  });

  it('handles action type SIGNUP_REGISTER_DISMISS_ERROR correctly', () => {
    const prevState = { signupError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SIGNUP_REGISTER_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.signupError).to.be.null;
  });
});