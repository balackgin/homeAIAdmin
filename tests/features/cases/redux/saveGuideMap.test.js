import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  CASES_SAVE_GUIDE_MAP_BEGIN,
  CASES_SAVE_GUIDE_MAP_SUCCESS,
  CASES_SAVE_GUIDE_MAP_FAILURE,
  CASES_SAVE_GUIDE_MAP_DISMISS_ERROR,
} from 'src/features/cases/redux/constants';

import {
  saveGuideMap,
  dismissSaveGuideMapError,
  doSaveGuideMap,
  reducer,
} from 'src/features/cases/redux/saveGuideMap';

describe('cases/redux/saveGuideMap', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by saveGuideMap', () => {
    expect(saveGuideMap()).to.have.property('type', CASES_SAVE_GUIDE_MAP_BEGIN);
  });

  it('returns correct action by dismissSaveGuideMapError', () => {
    expect(dismissSaveGuideMapError()).to.have.property('type', CASES_SAVE_GUIDE_MAP_DISMISS_ERROR);
  });

  // saga tests
  const generator = doSaveGuideMap();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches CASES_SAVE_GUIDE_MAP_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: CASES_SAVE_GUIDE_MAP_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches CASES_SAVE_GUIDE_MAP_FAILURE action when failed', () => {
    const generatorForError = doSaveGuideMap();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: CASES_SAVE_GUIDE_MAP_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type CASES_SAVE_GUIDE_MAP_BEGIN correctly', () => {
    const prevState = { saveGuideMapPending: false };
    const state = reducer(
      prevState,
      { type: CASES_SAVE_GUIDE_MAP_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveGuideMapPending).to.be.true;
  });

  it('handles action type CASES_SAVE_GUIDE_MAP_SUCCESS correctly', () => {
    const prevState = { saveGuideMapPending: true };
    const state = reducer(
      prevState,
      { type: CASES_SAVE_GUIDE_MAP_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveGuideMapPending).to.be.false;
  });

  it('handles action type CASES_SAVE_GUIDE_MAP_FAILURE correctly', () => {
    const prevState = { saveGuideMapPending: true };
    const state = reducer(
      prevState,
      { type: CASES_SAVE_GUIDE_MAP_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveGuideMapPending).to.be.false;
    expect(state.saveGuideMapError).to.exist;
  });

  it('handles action type CASES_SAVE_GUIDE_MAP_DISMISS_ERROR correctly', () => {
    const prevState = { saveGuideMapError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CASES_SAVE_GUIDE_MAP_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveGuideMapError).to.be.null;
  });
});