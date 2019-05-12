import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  SAMPLES_FETCH_CASE_LIST_BEGIN,
  SAMPLES_FETCH_CASE_LIST_SUCCESS,
  SAMPLES_FETCH_CASE_LIST_FAILURE,
  SAMPLES_FETCH_CASE_LIST_DISMISS_ERROR,
} from 'src/features/samples/redux/constants';

import {
  fetchCaseList,
  dismissFetchCaseListError,
  doFetchCaseList,
  reducer,
} from 'src/features/samples/redux/fetchCaseList';

describe('samples/redux/fetchCaseList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchCaseList', () => {
    expect(fetchCaseList()).to.have.property('type', SAMPLES_FETCH_CASE_LIST_BEGIN);
  });

  it('returns correct action by dismissFetchCaseListError', () => {
    expect(dismissFetchCaseListError()).to.have.property('type', SAMPLES_FETCH_CASE_LIST_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchCaseList();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches SAMPLES_FETCH_CASE_LIST_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: SAMPLES_FETCH_CASE_LIST_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches SAMPLES_FETCH_CASE_LIST_FAILURE action when failed', () => {
    const generatorForError = doFetchCaseList();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: SAMPLES_FETCH_CASE_LIST_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type SAMPLES_FETCH_CASE_LIST_BEGIN correctly', () => {
    const prevState = { fetchCaseListPending: false };
    const state = reducer(
      prevState,
      { type: SAMPLES_FETCH_CASE_LIST_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCaseListPending).to.be.true;
  });

  it('handles action type SAMPLES_FETCH_CASE_LIST_SUCCESS correctly', () => {
    const prevState = { fetchCaseListPending: true };
    const state = reducer(
      prevState,
      { type: SAMPLES_FETCH_CASE_LIST_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCaseListPending).to.be.false;
  });

  it('handles action type SAMPLES_FETCH_CASE_LIST_FAILURE correctly', () => {
    const prevState = { fetchCaseListPending: true };
    const state = reducer(
      prevState,
      { type: SAMPLES_FETCH_CASE_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCaseListPending).to.be.false;
    expect(state.fetchCaseListError).to.exist;
  });

  it('handles action type SAMPLES_FETCH_CASE_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCaseListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SAMPLES_FETCH_CASE_LIST_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCaseListError).to.be.null;
  });
});