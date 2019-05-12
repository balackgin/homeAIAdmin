import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  MESSAGES_FETCH_MESSAGE_LIST_BEGIN,
  MESSAGES_FETCH_MESSAGE_LIST_SUCCESS,
  MESSAGES_FETCH_MESSAGE_LIST_FAILURE,
  MESSAGES_FETCH_MESSAGE_LIST_DISMISS_ERROR,
} from 'src/features/messages/redux/constants';

import {
  fetchMessageList,
  dismissFetchMessageListError,
  doFetchMessageList,
  reducer,
} from 'src/features/messages/redux/fetchMessageList';

describe('messages/redux/fetchMessageList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchMessageList', () => {
    expect(fetchMessageList()).to.have.property('type', MESSAGES_FETCH_MESSAGE_LIST_BEGIN);
  });

  it('returns correct action by dismissFetchMessageListError', () => {
    expect(dismissFetchMessageListError()).to.have.property('type', MESSAGES_FETCH_MESSAGE_LIST_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchMessageList();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches MESSAGE_FETCH_MESSAGE_LIST_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: MESSAGES_FETCH_MESSAGE_LIST_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches MESSAGE_FETCH_MESSAGE_LIST_FAILURE action when failed', () => {
    const generatorForError = doFetchMessageList();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: MESSAGES_FETCH_MESSAGE_LIST_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type MESSAGE_FETCH_MESSAGE_LIST_BEGIN correctly', () => {
    const prevState = { fetchMessageListPending: false };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_MESSAGE_LIST_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchMessageListPending).to.be.true;
  });

  it('handles action type MESSAGE_FETCH_MESSAGE_LIST_SUCCESS correctly', () => {
    const prevState = { fetchMessageListPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_MESSAGE_LIST_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchMessageListPending).to.be.false;
  });

  it('handles action type MESSAGE_FETCH_MESSAGE_LIST_FAILURE correctly', () => {
    const prevState = { fetchMessageListPending: true };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_MESSAGE_LIST_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchMessageListPending).to.be.false;
    expect(state.fetchMessageListError).to.exist;
  });

  it('handles action type MESSAGE_FETCH_MESSAGE_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { fetchMessageListError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: MESSAGES_FETCH_MESSAGE_LIST_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchMessageListError).to.be.null;
  });
});