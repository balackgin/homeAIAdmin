import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  CASES_FETCH_CASES_BEGIN,
  CASES_FETCH_CASES_SUCCESS,
  CASES_FETCH_CASES_FAILURE,
  CASES_FETCH_CASES_DISMISS_ERROR,
} from 'src/features/cases/redux/constants';

import {
  fetchCases,
  dismissFetchCasesError,
  doFetchCases,
  reducer,
} from 'src/features/cases/redux/fetchCases';

describe('cases/redux/fetchCases', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchCases', () => {
    expect(fetchCases()).to.have.property('type', CASES_FETCH_CASES_BEGIN);
  });

  it('returns correct action by dismissFetchCasesError', () => {
    expect(dismissFetchCasesError()).to.have.property('type', CASES_FETCH_CASES_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchCases();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches CASES_FETCH_CASES_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: CASES_FETCH_CASES_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches CASES_FETCH_CASES_FAILURE action when failed', () => {
    const generatorForError = doFetchCases();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: CASES_FETCH_CASES_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type CASES_FETCH_CASES_BEGIN correctly', () => {
    const prevState = { fetchCasesPending: false };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_CASES_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCasesPending).to.be.true;
  });

  it('handles action type CASES_FETCH_CASES_SUCCESS correctly', () => {
    const prevState = { fetchCasesPending: true };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_CASES_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCasesPending).to.be.false;
  });

  it('handles action type CASES_FETCH_CASES_FAILURE correctly', () => {
    const prevState = { fetchCasesPending: true };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_CASES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCasesPending).to.be.false;
    expect(state.fetchCasesError).to.exist;
  });

  it('handles action type CASES_FETCH_CASES_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCasesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_CASES_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCasesError).to.be.null;
  });
});