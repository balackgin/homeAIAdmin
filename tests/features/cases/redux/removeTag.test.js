import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  CASES_REMOVE_TAG_BEGIN,
  CASES_REMOVE_TAG_SUCCESS,
  CASES_REMOVE_TAG_FAILURE,
  CASES_REMOVE_TAG_DISMISS_ERROR,
} from 'src/features/cases/redux/constants';

import {
  removeTag,
  dismissRemoveTagError,
  doRemoveTag,
  reducer,
} from 'src/features/cases/redux/removeTag';

describe('cases/redux/removeTag', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by removeTag', () => {
    expect(removeTag()).to.have.property('type', CASES_REMOVE_TAG_BEGIN);
  });

  it('returns correct action by dismissRemoveTagError', () => {
    expect(dismissRemoveTagError()).to.have.property('type', CASES_REMOVE_TAG_DISMISS_ERROR);
  });

  // saga tests
  const generator = doRemoveTag();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches CASES_REMOVE_TAG_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: CASES_REMOVE_TAG_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches CASES_REMOVE_TAG_FAILURE action when failed', () => {
    const generatorForError = doRemoveTag();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: CASES_REMOVE_TAG_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type CASES_REMOVE_TAG_BEGIN correctly', () => {
    const prevState = { removeTagPending: false };
    const state = reducer(
      prevState,
      { type: CASES_REMOVE_TAG_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removeTagPending).to.be.true;
  });

  it('handles action type CASES_REMOVE_TAG_SUCCESS correctly', () => {
    const prevState = { removeTagPending: true };
    const state = reducer(
      prevState,
      { type: CASES_REMOVE_TAG_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removeTagPending).to.be.false;
  });

  it('handles action type CASES_REMOVE_TAG_FAILURE correctly', () => {
    const prevState = { removeTagPending: true };
    const state = reducer(
      prevState,
      { type: CASES_REMOVE_TAG_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removeTagPending).to.be.false;
    expect(state.removeTagError).to.exist;
  });

  it('handles action type CASES_REMOVE_TAG_DISMISS_ERROR correctly', () => {
    const prevState = { removeTagError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CASES_REMOVE_TAG_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.removeTagError).to.be.null;
  });
});