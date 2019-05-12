import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  CASES_DELETE_CASE_BEGIN,
  CASES_DELETE_CASE_SUCCESS,
  CASES_DELETE_CASE_FAILURE,
  CASES_DELETE_CASE_DISMISS_ERROR,
} from 'src/features/cases/redux/constants';

import {
  deleteCase,
  dismissDeleteCaseError,
  doDeleteCase,
  reducer,
} from 'src/features/cases/redux/deleteCase';

describe('cases/redux/deleteCase', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by deleteCase', () => {
    expect(deleteCase()).to.have.property('type', CASES_DELETE_CASE_BEGIN);
  });

  it('returns correct action by dismissDeleteCaseError', () => {
    expect(dismissDeleteCaseError()).to.have.property('type', CASES_DELETE_CASE_DISMISS_ERROR);
  });

  // saga tests
  const generator = doDeleteCase();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches CASES_DELETE_CASE_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: CASES_DELETE_CASE_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches CASES_DELETE_CASE_FAILURE action when failed', () => {
    const generatorForError = doDeleteCase();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: CASES_DELETE_CASE_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type CASES_DELETE_CASE_BEGIN correctly', () => {
    const prevState = { deleteCasePending: false };
    const state = reducer(
      prevState,
      { type: CASES_DELETE_CASE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCasePending).to.be.true;
  });

  it('handles action type CASES_DELETE_CASE_SUCCESS correctly', () => {
    const prevState = { deleteCasePending: true };
    const state = reducer(
      prevState,
      { type: CASES_DELETE_CASE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCasePending).to.be.false;
  });

  it('handles action type CASES_DELETE_CASE_FAILURE correctly', () => {
    const prevState = { deleteCasePending: true };
    const state = reducer(
      prevState,
      { type: CASES_DELETE_CASE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCasePending).to.be.false;
    expect(state.deleteCaseError).to.exist;
  });

  it('handles action type CASES_DELETE_CASE_DISMISS_ERROR correctly', () => {
    const prevState = { deleteCaseError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CASES_DELETE_CASE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCaseError).to.be.null;
  });
});