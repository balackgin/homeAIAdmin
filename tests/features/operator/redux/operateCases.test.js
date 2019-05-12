import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  OPERATOR_OPERATE_CASES_BEGIN,
  OPERATOR_OPERATE_CASES_SUCCESS,
  OPERATOR_OPERATE_CASES_FAILURE,
  OPERATOR_OPERATE_CASES_DISMISS_ERROR,
} from 'src/features/operator/redux/constants';

import {
  operateCases,
  dismissOperateCasesError,
  doOperateCases,
  reducer,
} from 'src/features/operator/redux/operateCases';

describe('operator/redux/operateCases', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by deleteCases', () => {
    expect(operateCases()).to.have.property('type', OPERATOR_OPERATE_CASES_BEGIN);
  });

  it('returns correct action by dismissOperateCasesError', () => {
    expect(dismissOperateCasesError()).to.have.property('type', OPERATOR_OPERATE_CASES_DISMISS_ERROR);
  });

  // saga tests
  const generator = doOperateCases();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches OPERATOR_DELETE_CASES_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: OPERATOR_OPERATE_CASES_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches OPERATOR_DELETE_CASES_FAILURE action when failed', () => {
    const generatorForError = doOperateCases();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: OPERATOR_OPERATE_CASES_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type OPERATOR_OPERATE_CASES_BEGIN correctly', () => {
    const prevState = { deleteCasesPending: false };
    const state = reducer(
      prevState,
      { type: OPERATOR_OPERATE_CASES_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCasesPending).to.be.true;
  });

  it('handles action type OPERATOR_OPERATE_CASES_SUCCESS correctly', () => {
    const prevState = { deleteCasesPending: true };
    const state = reducer(
      prevState,
      { type: OPERATOR_OPERATE_CASES_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCasesPending).to.be.false;
  });

  it('handles action type OPERATOR_OPERATE_CASES_FAILURE correctly', () => {
    const prevState = { deleteCasesPending: true };
    const state = reducer(
      prevState,
      { type: OPERATOR_OPERATE_CASES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCasesPending).to.be.false;
    expect(state.deleteCasesError).to.exist;
  });

  it('handles action type OPERATOR_OPERATE_CASES_DISMISS_ERROR correctly', () => {
    const prevState = { deleteCasesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: OPERATOR_OPERATE_CASES_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCasesError).to.be.null;
  });
});