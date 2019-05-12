import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  PROJECT_FETCH_PROJECT_DTL_BEGIN,
  PROJECT_FETCH_PROJECT_DTL_SUCCESS,
  PROJECT_FETCH_PROJECT_DTL_FAILURE,
  PROJECT_FETCH_PROJECT_DTL_DISMISS_ERROR,
} from 'src/features/project/redux/constants';

import {
  fetchProjectDtl,
  dismissFetchProjectDtlError,
  doFetchProjectDtl,
  reducer,
} from 'src/features/project/redux/fetchProjectDtl';

describe('project/redux/fetchProjectDtl', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchProjectDtl', () => {
    expect(fetchProjectDtl()).to.have.property('type', PROJECT_FETCH_PROJECT_DTL_BEGIN);
  });

  it('returns correct action by dismissFetchProjectDtlError', () => {
    expect(dismissFetchProjectDtlError()).to.have.property('type', PROJECT_FETCH_PROJECT_DTL_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchProjectDtl();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches PROJECT_FETCH_PROJECT_DTL_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: PROJECT_FETCH_PROJECT_DTL_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches PROJECT_FETCH_PROJECT_DTL_FAILURE action when failed', () => {
    const generatorForError = doFetchProjectDtl();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: PROJECT_FETCH_PROJECT_DTL_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type PROJECT_FETCH_PROJECT_DTL_BEGIN correctly', () => {
    const prevState = { fetchProjectDtlPending: false };
    const state = reducer(
      prevState,
      { type: PROJECT_FETCH_PROJECT_DTL_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDtlPending).to.be.true;
  });

  it('handles action type PROJECT_FETCH_PROJECT_DTL_SUCCESS correctly', () => {
    const prevState = { fetchProjectDtlPending: true };
    const state = reducer(
      prevState,
      { type: PROJECT_FETCH_PROJECT_DTL_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDtlPending).to.be.false;
  });

  it('handles action type PROJECT_FETCH_PROJECT_DTL_FAILURE correctly', () => {
    const prevState = { fetchProjectDtlPending: true };
    const state = reducer(
      prevState,
      { type: PROJECT_FETCH_PROJECT_DTL_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDtlPending).to.be.false;
    expect(state.fetchProjectDtlError).to.exist;
  });

  it('handles action type PROJECT_FETCH_PROJECT_DTL_DISMISS_ERROR correctly', () => {
    const prevState = { fetchProjectDtlError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: PROJECT_FETCH_PROJECT_DTL_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDtlError).to.be.null;
  });
});