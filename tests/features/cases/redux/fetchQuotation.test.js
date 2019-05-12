import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  CASES_FETCH_QUOTATION_BEGIN,
  CASES_FETCH_QUOTATION_SUCCESS,
  CASES_FETCH_QUOTATION_FAILURE,
  CASES_FETCH_QUOTATION_DISMISS_ERROR,
} from 'src/features/cases/redux/constants';

import {
  fetchQuotation,
  dismissFetchQuotationError,
  doFetchQuotation,
  reducer,
} from 'src/features/cases/redux/fetchQuotation';

describe('cases/redux/fetchQuotation', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchQuotation', () => {
    expect(fetchQuotation()).to.have.property('type', CASES_FETCH_QUOTATION_BEGIN);
  });

  it('returns correct action by dismissFetchQuotationError', () => {
    expect(dismissFetchQuotationError()).to.have.property('type', CASES_FETCH_QUOTATION_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchQuotation();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches CASES_FETCH_QUOTATION_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: CASES_FETCH_QUOTATION_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches CASES_FETCH_QUOTATION_FAILURE action when failed', () => {
    const generatorForError = doFetchQuotation();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: CASES_FETCH_QUOTATION_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type CASES_FETCH_QUOTATION_BEGIN correctly', () => {
    const prevState = { fetchQuotationPending: false };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_QUOTATION_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchQuotationPending).to.be.true;
  });

  it('handles action type CASES_FETCH_QUOTATION_SUCCESS correctly', () => {
    const prevState = { fetchQuotationPending: true };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_QUOTATION_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchQuotationPending).to.be.false;
  });

  it('handles action type CASES_FETCH_QUOTATION_FAILURE correctly', () => {
    const prevState = { fetchQuotationPending: true };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_QUOTATION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchQuotationPending).to.be.false;
    expect(state.fetchQuotationError).to.exist;
  });

  it('handles action type CASES_FETCH_QUOTATION_DISMISS_ERROR correctly', () => {
    const prevState = { fetchQuotationError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_QUOTATION_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchQuotationError).to.be.null;
  });
});