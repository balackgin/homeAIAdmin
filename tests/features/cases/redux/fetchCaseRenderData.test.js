import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  CASES_FETCH_CASE_RENDER_DATA_BEGIN,
  CASES_FETCH_CASE_RENDER_DATA_SUCCESS,
  CASES_FETCH_CASE_RENDER_DATA_FAILURE,
  CASES_FETCH_CASE_RENDER_DATA_DISMISS_ERROR,
} from 'src/features/cases/redux/constants';

import {
  fetchCaseRenderData,
  dismissFetchCaseRenderDataError,
  doFetchCaseRenderData,
  reducer,
} from 'src/features/cases/redux/fetchCaseRenderData';

describe('cases/redux/fetchCaseRenderData', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchCaseRenderData', () => {
    expect(fetchCaseRenderData()).to.have.property('type', CASES_FETCH_CASE_RENDER_DATA_BEGIN);
  });

  it('returns correct action by dismissFetchCaseRenderDataError', () => {
    expect(dismissFetchCaseRenderDataError()).to.have.property('type', CASES_FETCH_CASE_RENDER_DATA_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchCaseRenderData();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches CASES_FETCH_CASE_RENDER_DATA_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: CASES_FETCH_CASE_RENDER_DATA_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches CASES_FETCH_CASE_RENDER_DATA_FAILURE action when failed', () => {
    const generatorForError = doFetchCaseRenderData();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: CASES_FETCH_CASE_RENDER_DATA_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type CASES_FETCH_CASE_RENDER_DATA_BEGIN correctly', () => {
    const prevState = { fetchCaseRenderDataPending: false };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_CASE_RENDER_DATA_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCaseRenderDataPending).to.be.true;
  });

  it('handles action type CASES_FETCH_CASE_RENDER_DATA_SUCCESS correctly', () => {
    const prevState = { fetchCaseRenderDataPending: true };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_CASE_RENDER_DATA_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCaseRenderDataPending).to.be.false;
  });

  it('handles action type CASES_FETCH_CASE_RENDER_DATA_FAILURE correctly', () => {
    const prevState = { fetchCaseRenderDataPending: true };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_CASE_RENDER_DATA_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCaseRenderDataPending).to.be.false;
    expect(state.fetchCaseRenderDataError).to.exist;
  });

  it('handles action type CASES_FETCH_CASE_RENDER_DATA_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCaseRenderDataError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_CASE_RENDER_DATA_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCaseRenderDataError).to.be.null;
  });
});