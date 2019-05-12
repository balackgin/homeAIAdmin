import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  CASES_UPDATE_GUIDE_MAP_BEGIN,
  CASES_UPDATE_GUIDE_MAP_SUCCESS,
  CASES_UPDATE_GUIDE_MAP_FAILURE,
  CASES_UPDATE_GUIDE_MAP_DISMISS_ERROR,
} from 'src/features/cases/redux/constants';

import {
  updateGuideMap,
  dismissUpdateGuideMapError,
  doUpdateGuideMap,
  reducer,
} from 'src/features/cases/redux/updateGuideMap';

describe('cases/redux/updateGuideMap', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by updateGuideMap', () => {
    expect(updateGuideMap()).to.have.property('type', CASES_UPDATE_GUIDE_MAP_BEGIN);
  });

  it('returns correct action by dismissUpdateGuideMapError', () => {
    expect(dismissUpdateGuideMapError()).to.have.property('type', CASES_UPDATE_GUIDE_MAP_DISMISS_ERROR);
  });

  // saga tests
  const generator = doUpdateGuideMap();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches CASES_UPDATE_GUIDE_MAP_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: CASES_UPDATE_GUIDE_MAP_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches CASES_UPDATE_GUIDE_MAP_FAILURE action when failed', () => {
    const generatorForError = doUpdateGuideMap();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: CASES_UPDATE_GUIDE_MAP_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type CASES_UPDATE_GUIDE_MAP_BEGIN correctly', () => {
    const prevState = { updateGuideMapPending: false };
    const state = reducer(
      prevState,
      { type: CASES_UPDATE_GUIDE_MAP_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updateGuideMapPending).to.be.true;
  });

  it('handles action type CASES_UPDATE_GUIDE_MAP_SUCCESS correctly', () => {
    const prevState = { updateGuideMapPending: true };
    const state = reducer(
      prevState,
      { type: CASES_UPDATE_GUIDE_MAP_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updateGuideMapPending).to.be.false;
  });

  it('handles action type CASES_UPDATE_GUIDE_MAP_FAILURE correctly', () => {
    const prevState = { updateGuideMapPending: true };
    const state = reducer(
      prevState,
      { type: CASES_UPDATE_GUIDE_MAP_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updateGuideMapPending).to.be.false;
    expect(state.updateGuideMapError).to.exist;
  });

  it('handles action type CASES_UPDATE_GUIDE_MAP_DISMISS_ERROR correctly', () => {
    const prevState = { updateGuideMapError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CASES_UPDATE_GUIDE_MAP_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updateGuideMapError).to.be.null;
  });
});