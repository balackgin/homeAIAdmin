import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  SAMPLES_POST_SAMPLE_ACTION_BEGIN,
  SAMPLES_POST_SAMPLE_ACTION_SUCCESS,
  SAMPLES_POST_SAMPLE_ACTION_FAILURE,
  SAMPLES_POST_SAMPLE_ACTION_DISMISS_ERROR,
} from 'src/features/samples/redux/constants';

import {
  postSampleAction,
  dismissPostSampleActionError,
  doPostSampleAction,
  reducer,
} from 'src/features/samples/redux/postSampleAction';

describe('samples/redux/postSampleAction', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by postSample', () => {
    expect(postSampleAction()).to.have.property('type', SAMPLES_POST_SAMPLE_ACTION_BEGIN);
  });

  it('returns correct action by dismissPostSampleActionError', () => {
    expect(dismissPostSampleActionError()).to.have.property('type', SAMPLES_POST_SAMPLE_ACTION_DISMISS_ERROR);
  });

  // saga tests
  const generator = doPostSampleAction();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches SAMPLES_POST_SAMPLE_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: SAMPLES_POST_SAMPLE_ACTION_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches SAMPLES_POST_SAMPLE_FAILURE action when failed', () => {
    const generatorForError = doPostSampleAction();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: SAMPLES_POST_SAMPLE_ACTION_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type SAMPLES_POST_SAMPLE_ACTION_BEGIN correctly', () => {
    const prevState = { postSamplePending: false };
    const state = reducer(
      prevState,
      { type: SAMPLES_POST_SAMPLE_ACTION_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.postSamplePending).to.be.true;
  });

  it('handles action type SAMPLES_POST_SAMPLE_ACTION_SUCCESS correctly', () => {
    const prevState = { postSamplePending: true };
    const state = reducer(
      prevState,
      { type: SAMPLES_POST_SAMPLE_ACTION_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.postSamplePending).to.be.false;
  });

  it('handles action type SAMPLES_POST_SAMPLE_ACTION_FAILURE correctly', () => {
    const prevState = { postSamplePending: true };
    const state = reducer(
      prevState,
      { type: SAMPLES_POST_SAMPLE_ACTION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.postSamplePending).to.be.false;
    expect(state.postSampleError).to.exist;
  });

  it('handles action type SAMPLES_POST_SAMPLE_ACTION_DISMISS_ERROR correctly', () => {
    const prevState = { postSampleError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SAMPLES_POST_SAMPLE_ACTION_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.postSampleError).to.be.null;
  });
});