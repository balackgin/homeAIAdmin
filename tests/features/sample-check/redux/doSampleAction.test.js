import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  SAMPLE_CHECK_DO_SAMPLE_ACTION_BEGIN,
  SAMPLE_CHECK_DO_SAMPLE_ACTION_SUCCESS,
  SAMPLE_CHECK_DO_SAMPLE_ACTION_FAILURE,
  SAMPLE_CHECK_DO_SAMPLE_ACTION_DISMISS_ERROR,
} from 'src/features/sample-check/redux/constants';

import {
  doSampleAction,
  dismissDoSampleActionError,
  doDoSampleAction,
  reducer,
} from 'src/features/sample-check/redux/doSampleAction';

describe('sample-check/redux/doSampleAction', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by doSampleAction', () => {
    expect(doSampleAction()).to.have.property('type', SAMPLE_CHECK_DO_SAMPLE_ACTION_BEGIN);
  });

  it('returns correct action by dismissDoSampleActionError', () => {
    expect(dismissDoSampleActionError()).to.have.property('type', SAMPLE_CHECK_DO_SAMPLE_ACTION_DISMISS_ERROR);
  });

  // saga tests
  const generator = doDoSampleAction();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches SAMPLE_CHECK_DO_SAMPLE_ACTION_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: SAMPLE_CHECK_DO_SAMPLE_ACTION_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches SAMPLE_CHECK_DO_SAMPLE_ACTION_FAILURE action when failed', () => {
    const generatorForError = doDoSampleAction();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: SAMPLE_CHECK_DO_SAMPLE_ACTION_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type SAMPLE_CHECK_DO_SAMPLE_ACTION_BEGIN correctly', () => {
    const prevState = { doSampleActionPending: false };
    const state = reducer(
      prevState,
      { type: SAMPLE_CHECK_DO_SAMPLE_ACTION_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.doSampleActionPending).to.be.true;
  });

  it('handles action type SAMPLE_CHECK_DO_SAMPLE_ACTION_SUCCESS correctly', () => {
    const prevState = { doSampleActionPending: true };
    const state = reducer(
      prevState,
      { type: SAMPLE_CHECK_DO_SAMPLE_ACTION_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.doSampleActionPending).to.be.false;
  });

  it('handles action type SAMPLE_CHECK_DO_SAMPLE_ACTION_FAILURE correctly', () => {
    const prevState = { doSampleActionPending: true };
    const state = reducer(
      prevState,
      { type: SAMPLE_CHECK_DO_SAMPLE_ACTION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.doSampleActionPending).to.be.false;
    expect(state.doSampleActionError).to.exist;
  });

  it('handles action type SAMPLE_CHECK_DO_SAMPLE_ACTION_DISMISS_ERROR correctly', () => {
    const prevState = { doSampleActionError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SAMPLE_CHECK_DO_SAMPLE_ACTION_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.doSampleActionError).to.be.null;
  });
});