import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  CASES_ADD_TAG_BEGIN,
  CASES_ADD_TAG_SUCCESS,
  CASES_ADD_TAG_FAILURE,
  CASES_ADD_TAG_DISMISS_ERROR,
} from 'src/features/cases/redux/constants';

import {
  addTag,
  dismissAddTagError,
  doAddTag,
  reducer,
} from 'src/features/cases/redux/addTag';

describe('cases/redux/addTag', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by addTag', () => {
    expect(addTag()).to.have.property('type', CASES_ADD_TAG_BEGIN);
  });

  it('returns correct action by dismissAddTagError', () => {
    expect(dismissAddTagError()).to.have.property('type', CASES_ADD_TAG_DISMISS_ERROR);
  });

  // saga tests
  const generator = doAddTag();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches CASES_ADD_TAG_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: CASES_ADD_TAG_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches CASES_ADD_TAG_FAILURE action when failed', () => {
    const generatorForError = doAddTag();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: CASES_ADD_TAG_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type CASES_ADD_TAG_BEGIN correctly', () => {
    const prevState = { addTagPending: false };
    const state = reducer(
      prevState,
      { type: CASES_ADD_TAG_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addTagPending).to.be.true;
  });

  it('handles action type CASES_ADD_TAG_SUCCESS correctly', () => {
    const prevState = { addTagPending: true };
    const state = reducer(
      prevState,
      { type: CASES_ADD_TAG_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addTagPending).to.be.false;
  });

  it('handles action type CASES_ADD_TAG_FAILURE correctly', () => {
    const prevState = { addTagPending: true };
    const state = reducer(
      prevState,
      { type: CASES_ADD_TAG_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addTagPending).to.be.false;
    expect(state.addTagError).to.exist;
  });

  it('handles action type CASES_ADD_TAG_DISMISS_ERROR correctly', () => {
    const prevState = { addTagError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CASES_ADD_TAG_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addTagError).to.be.null;
  });
});