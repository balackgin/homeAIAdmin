import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  CASES_SAVE_COVER_BEGIN,
  CASES_SAVE_COVER_SUCCESS,
  CASES_SAVE_COVER_FAILURE,
  CASES_SAVE_COVER_DISMISS_ERROR,
} from 'src/features/cases/redux/constants';

import {
  saveCover,
  dismissSaveCoverError,
  doSaveCover,
  reducer,
} from 'src/features/cases/redux/saveCover';

describe('cases/redux/saveCover', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by saveCover', () => {
    expect(saveCover()).to.have.property('type', CASES_SAVE_COVER_BEGIN);
  });

  it('returns correct action by dismissSaveCoverError', () => {
    expect(dismissSaveCoverError()).to.have.property('type', CASES_SAVE_COVER_DISMISS_ERROR);
  });

  // saga tests
  const generator = doSaveCover();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches CASES_SAVE_COVER_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: CASES_SAVE_COVER_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches CASES_SAVE_COVER_FAILURE action when failed', () => {
    const generatorForError = doSaveCover();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: CASES_SAVE_COVER_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type CASES_SAVE_COVER_BEGIN correctly', () => {
    const prevState = { saveCoverPending: false };
    const state = reducer(
      prevState,
      { type: CASES_SAVE_COVER_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCoverPending).to.be.true;
  });

  it('handles action type CASES_SAVE_COVER_SUCCESS correctly', () => {
    const prevState = { saveCoverPending: true };
    const state = reducer(
      prevState,
      { type: CASES_SAVE_COVER_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCoverPending).to.be.false;
  });

  it('handles action type CASES_SAVE_COVER_FAILURE correctly', () => {
    const prevState = { saveCoverPending: true };
    const state = reducer(
      prevState,
      { type: CASES_SAVE_COVER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCoverPending).to.be.false;
    expect(state.saveCoverError).to.exist;
  });

  it('handles action type CASES_SAVE_COVER_DISMISS_ERROR correctly', () => {
    const prevState = { saveCoverError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CASES_SAVE_COVER_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCoverError).to.be.null;
  });
});