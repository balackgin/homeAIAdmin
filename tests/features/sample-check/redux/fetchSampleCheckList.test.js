import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_BEGIN,
  SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_SUCCESS,
  SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_FAILURE,
  SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_DISMISS_ERROR,
} from 'src/features/sample-check/redux/constants';

import {
  fetchSampleCheckList,
  dismissFetchSampleCheckListError,
  doFetchSampleCheckList,
  reducer,
} from 'src/features/sample-check/redux/fetchSampleCheckList';

describe('sample-check/redux/fetchSampleCheckList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchSampleCheckList', () => {
    expect(fetchSampleCheckList()).to.have.property('type', SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_BEGIN);
  });

  it('returns correct action by dismissFetchSampleCheckListError', () => {
    expect(dismissFetchSampleCheckListError()).to.have.property('type', SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchSampleCheckList();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_FAILURE action when failed', () => {
    const generatorForError = doFetchSampleCheckList();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_BEGIN correctly', () => {
    const prevState = { fetchSampleCheckListPending: false };
    const state = reducer(
      prevState,
      { type: SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSampleCheckListPending).to.be.true;
  });

  it('handles action type SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_SUCCESS correctly', () => {
    const prevState = { fetchSampleCheckListPending: true };
    const state = reducer(
      prevState,
      { type: SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSampleCheckListPending).to.be.false;
  });

  it('handles action type SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_FAILURE correctly', () => {
    const prevState = { fetchSampleCheckListPending: true };
    const state = reducer(
      prevState,
      { type: SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSampleCheckListPending).to.be.false;
    expect(state.fetchSampleCheckListError).to.exist;
  });

  it('handles action type SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { fetchSampleCheckListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SAMPLE_CHECK_FETCH_SAMPLE_CHECK_LIST_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchSampleCheckListError).to.be.null;
  });
});