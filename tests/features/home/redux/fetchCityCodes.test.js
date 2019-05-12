import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_FETCH_CITY_CODES_BEGIN,
  HOME_FETCH_CITY_CODES_SUCCESS,
  HOME_FETCH_CITY_CODES_FAILURE,
  HOME_FETCH_CITY_CODES_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  fetchCityCodes,
  dismissFetchCityCodesError,
  doFetchCityCodes,
  reducer,
} from 'src/features/home/redux/fetchCityCodes';

describe('home/redux/fetchCityCodes', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchCityCodes', () => {
    expect(fetchCityCodes()).to.have.property('type', HOME_FETCH_CITY_CODES_BEGIN);
  });

  it('returns correct action by dismissFetchCityCodesError', () => {
    expect(dismissFetchCityCodesError()).to.have.property('type', HOME_FETCH_CITY_CODES_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchCityCodes();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches HOME_FETCH_CITY_CODES_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: HOME_FETCH_CITY_CODES_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches HOME_FETCH_CITY_CODES_FAILURE action when failed', () => {
    const generatorForError = doFetchCityCodes();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: HOME_FETCH_CITY_CODES_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type HOME_FETCH_CITY_CODES_BEGIN correctly', () => {
    const prevState = { fetchCityCodesPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_CITY_CODES_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCityCodesPending).to.be.true;
  });

  it('handles action type HOME_FETCH_CITY_CODES_SUCCESS correctly', () => {
    const prevState = { fetchCityCodesPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_CITY_CODES_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCityCodesPending).to.be.false;
  });

  it('handles action type HOME_FETCH_CITY_CODES_FAILURE correctly', () => {
    const prevState = { fetchCityCodesPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_CITY_CODES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCityCodesPending).to.be.false;
    expect(state.fetchCityCodesError).to.exist;
  });

  it('handles action type HOME_FETCH_CITY_CODES_DISMISS_ERROR correctly', () => {
    const prevState = { fetchCityCodesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_CITY_CODES_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchCityCodesError).to.be.null;
  });
});