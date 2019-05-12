import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  PROJECT_FETCH_PROJECT_LIST_BEGIN,
  PROJECT_FETCH_PROJECT_LIST_SUCCESS,
  PROJECT_FETCH_PROJECT_LIST_FAILURE,
  PROJECT_FETCH_PROJECT_LIST_DISMISS_ERROR,
} from 'src/features/project/redux/constants';

import {
  fetchProjectList,
  dismissFetchProjectListError,
  doFetchProjectList,
  reducer,
} from 'src/features/project/redux/fetchProjectList';

describe('project/redux/fetchProjectList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchProjectList', () => {
    expect(fetchProjectList()).to.have.property('type', PROJECT_FETCH_PROJECT_LIST_BEGIN);
  });

  it('returns correct action by dismissFetchProjectListError', () => {
    expect(dismissFetchProjectListError()).to.have.property('type', PROJECT_FETCH_PROJECT_LIST_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchProjectList();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches PROJECT_FETCH_PROJECT_LIST_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: PROJECT_FETCH_PROJECT_LIST_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches PROJECT_FETCH_PROJECT_LIST_FAILURE action when failed', () => {
    const generatorForError = doFetchProjectList();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: PROJECT_FETCH_PROJECT_LIST_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type PROJECT_FETCH_PROJECT_LIST_BEGIN correctly', () => {
    const prevState = { fetchProjectListPending: false };
    const state = reducer(
      prevState,
      { type: PROJECT_FETCH_PROJECT_LIST_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectListPending).to.be.true;
  });

  it('handles action type PROJECT_FETCH_PROJECT_LIST_SUCCESS correctly', () => {
    const prevState = { fetchProjectListPending: true };
    const state = reducer(
      prevState,
      { type: PROJECT_FETCH_PROJECT_LIST_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectListPending).to.be.false;
  });

  it('handles action type PROJECT_FETCH_PROJECT_LIST_FAILURE correctly', () => {
    const prevState = { fetchProjectListPending: true };
    const state = reducer(
      prevState,
      { type: PROJECT_FETCH_PROJECT_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectListPending).to.be.false;
    expect(state.fetchProjectListError).to.exist;
  });

  it('handles action type PROJECT_FETCH_PROJECT_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { fetchProjectListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: PROJECT_FETCH_PROJECT_LIST_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectListError).to.be.null;
  });
});