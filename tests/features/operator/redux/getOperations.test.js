import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  OPERATOR_GET_OPERATIONS_BEGIN,
  OPERATOR_GET_OPERATIONS_SUCCESS,
  OPERATOR_GET_OPERATIONS_FAILURE,
  OPERATOR_GET_OPERATIONS_DISMISS_ERROR,
} from 'src/features/operator/redux/constants';

import {
  getOperations,
  dismissGetOperationsError,
  doGetOperations,
  reducer,
} from 'src/features/operator/redux/getOperations';

describe('operator/redux/getOperations', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by getOperations', () => {
    expect(getOperations()).to.have.property('type', OPERATOR_GET_OPERATIONS_BEGIN);
  });

  it('returns correct action by dismissGetOperationsError', () => {
    expect(dismissGetOperationsError()).to.have.property('type', OPERATOR_GET_OPERATIONS_DISMISS_ERROR);
  });

  // saga tests
  const generator = doGetOperations();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches OPERATOR_GET_OPERATIONS_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: OPERATOR_GET_OPERATIONS_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches OPERATOR_GET_OPERATIONS_FAILURE action when failed', () => {
    const generatorForError = doGetOperations();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: OPERATOR_GET_OPERATIONS_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type OPERATOR_GET_OPERATIONS_BEGIN correctly', () => {
    const prevState = { getOperationsPending: false };
    const state = reducer(
      prevState,
      { type: OPERATOR_GET_OPERATIONS_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getOperationsPending).to.be.true;
  });

  it('handles action type OPERATOR_GET_OPERATIONS_SUCCESS correctly', () => {
    const prevState = { getOperationsPending: true };
    const state = reducer(
      prevState,
      { type: OPERATOR_GET_OPERATIONS_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getOperationsPending).to.be.false;
  });

  it('handles action type OPERATOR_GET_OPERATIONS_FAILURE correctly', () => {
    const prevState = { getOperationsPending: true };
    const state = reducer(
      prevState,
      { type: OPERATOR_GET_OPERATIONS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getOperationsPending).to.be.false;
    expect(state.getOperationsError).to.exist;
  });

  it('handles action type OPERATOR_GET_OPERATIONS_DISMISS_ERROR correctly', () => {
    const prevState = { getOperationsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: OPERATOR_GET_OPERATIONS_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getOperationsError).to.be.null;
  });
});