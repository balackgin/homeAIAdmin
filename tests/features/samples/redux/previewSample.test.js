import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  SAMPLES_PREVIEW_SAMPLE_BEGIN,
  SAMPLES_PREVIEW_SAMPLE_SUCCESS,
  SAMPLES_PREVIEW_SAMPLE_FAILURE,
  SAMPLES_PREVIEW_SAMPLE_DISMISS_ERROR,
} from 'src/features/samples/redux/constants';

import {
  previewSample,
  dismissPreviewSampleError,
  doPreviewSample,
  reducer,
} from 'src/features/samples/redux/previewSample';

describe('samples/redux/previewSample', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by previewSample', () => {
    expect(previewSample()).to.have.property('type', SAMPLES_PREVIEW_SAMPLE_BEGIN);
  });

  it('returns correct action by dismissPreviewSampleError', () => {
    expect(dismissPreviewSampleError()).to.have.property('type', SAMPLES_PREVIEW_SAMPLE_DISMISS_ERROR);
  });

  // saga tests
  const generator = doPreviewSample();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches SAMPLES_PREVIEW_SAMPLE_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: SAMPLES_PREVIEW_SAMPLE_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches SAMPLES_PREVIEW_SAMPLE_FAILURE action when failed', () => {
    const generatorForError = doPreviewSample();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: SAMPLES_PREVIEW_SAMPLE_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type SAMPLES_PREVIEW_SAMPLE_BEGIN correctly', () => {
    const prevState = { previewSamplePending: false };
    const state = reducer(
      prevState,
      { type: SAMPLES_PREVIEW_SAMPLE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.previewSamplePending).to.be.true;
  });

  it('handles action type SAMPLES_PREVIEW_SAMPLE_SUCCESS correctly', () => {
    const prevState = { previewSamplePending: true };
    const state = reducer(
      prevState,
      { type: SAMPLES_PREVIEW_SAMPLE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.previewSamplePending).to.be.false;
  });

  it('handles action type SAMPLES_PREVIEW_SAMPLE_FAILURE correctly', () => {
    const prevState = { previewSamplePending: true };
    const state = reducer(
      prevState,
      { type: SAMPLES_PREVIEW_SAMPLE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.previewSamplePending).to.be.false;
    expect(state.previewSampleError).to.exist;
  });

  it('handles action type SAMPLES_PREVIEW_SAMPLE_DISMISS_ERROR correctly', () => {
    const prevState = { previewSampleError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SAMPLES_PREVIEW_SAMPLE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.previewSampleError).to.be.null;
  });
});