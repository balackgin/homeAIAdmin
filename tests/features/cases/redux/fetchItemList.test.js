import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  CASES_FETCH_ITEM_LIST_BEGIN,
  CASES_FETCH_ITEM_LIST_SUCCESS,
  CASES_FETCH_ITEM_LIST_FAILURE,
  CASES_FETCH_ITEM_LIST_DISMISS_ERROR,
} from 'src/features/cases/redux/constants';

import {
  fetchItemList,
  dismissFetchItemListError,
  doFetchItemList,
  reducer,
} from 'src/features/cases/redux/fetchItemList';

describe('cases/redux/fetchItemList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchItemList', () => {
    expect(fetchItemList()).to.have.property('type', CASES_FETCH_ITEM_LIST_BEGIN);
  });

  it('returns correct action by dismissFetchItemListError', () => {
    expect(dismissFetchItemListError()).to.have.property('type', CASES_FETCH_ITEM_LIST_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchItemList();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches CASES_FETCH_ITEM_LIST_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: CASES_FETCH_ITEM_LIST_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches CASES_FETCH_ITEM_LIST_FAILURE action when failed', () => {
    const generatorForError = doFetchItemList();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: CASES_FETCH_ITEM_LIST_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type CASES_FETCH_ITEM_LIST_BEGIN correctly', () => {
    const prevState = { fetchItemListPending: false };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_ITEM_LIST_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchItemListPending).to.be.true;
  });

  it('handles action type CASES_FETCH_ITEM_LIST_SUCCESS correctly', () => {
    const prevState = { fetchItemListPending: true };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_ITEM_LIST_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchItemListPending).to.be.false;
  });

  it('handles action type CASES_FETCH_ITEM_LIST_FAILURE correctly', () => {
    const prevState = { fetchItemListPending: true };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_ITEM_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchItemListPending).to.be.false;
    expect(state.fetchItemListError).to.exist;
  });

  it('handles action type CASES_FETCH_ITEM_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { fetchItemListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CASES_FETCH_ITEM_LIST_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchItemListError).to.be.null;
  });
});