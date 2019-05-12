import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  SAMPLES_FETCH_SAMPLE_DETAIL_BEGIN,
  SAMPLES_FETCH_SAMPLE_DETAIL_SUCCESS,
  SAMPLES_FETCH_SAMPLE_DETAIL_FAILURE,
  SAMPLES_FETCH_SAMPLE_DETAIL_DISMISS_ERROR,
} from 'src/features/samples/redux/constants';

import {
  fetchSampleDetail,
  dismissFetchSampleDetailError,
  doFetchSampleDetail,
  reducer,
} from 'src/features/samples/redux/fetchSampleDetail';

describe('samples/redux/fetchSampleDetail', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchSampleDetail', () => {
    expect(fetchSampleDetail()).to.have.property('type', SAMPLES_FETCH_SAMPLE_DETAIL_BEGIN);
  });

  it('returns correct action by dismissFetchSampleDetailError', () => {
    expect(dismissFetchSampleDetailError()).to.have.property('type', SAMPLES_FETCH_SAMPLE_DETAIL_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchSampleDetail();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches SAMPLES_FETCH_SAMPLE_DETAIL_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: SAMPLES_FETCH_SAMPLE_DETAIL_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches SAMPLES_FETCH_SAMPLE_DETAIL_FAILURE action when failed', () => {
    const generatorForError = doFetchSampleDetail();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: SAMPLES_FETCH_SAMPLE_DETAIL_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type SAMPLES_FETCH_SAMPLE_DETAIL_BEGIN correctly', () => {
    const prevState = { fetchSampleDetailPending: false };
    const state = reducer(
      prevState,
      { type: SAMPLES_FETCH_SAMPLE_DETAIL_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSampleDetailPending).to.be.true;
  });

  it('handles action type SAMPLES_FETCH_SAMPLE_DETAIL_SUCCESS correctly', () => {
    const prevState = { fetchSampleDetailPending: true };
    const state = reducer(
      prevState,
      { type: SAMPLES_FETCH_SAMPLE_DETAIL_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSampleDetailPending).to.be.false;
  });

  it('handles action type SAMPLES_FETCH_SAMPLE_DETAIL_FAILURE correctly', () => {
    const prevState = { fetchSampleDetailPending: true };
    const state = reducer(
      prevState,
      { type: SAMPLES_FETCH_SAMPLE_DETAIL_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSampleDetailPending).to.be.false;
    expect(state.fetchSampleDetailError).to.exist;
  });

  it('handles action type SAMPLES_FETCH_SAMPLE_DETAIL_DISMISS_ERROR correctly', () => {
    const prevState = { fetchSampleDetailError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SAMPLES_FETCH_SAMPLE_DETAIL_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSampleDetailError).to.be.null;
  });
});