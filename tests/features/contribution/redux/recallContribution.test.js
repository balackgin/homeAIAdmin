import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  CONTRIBUTION_RECALL_CONTRIBUTION_BEGIN,
  CONTRIBUTION_RECALL_CONTRIBUTION_SUCCESS,
  CONTRIBUTION_RECALL_CONTRIBUTION_FAILURE,
  CONTRIBUTION_RECALL_CONTRIBUTION_DISMISS_ERROR,
} from 'src/features/contribution/redux/constants';

import {
  recallContribution,
  dismissRecallContributionError,
  doRecallContribution,
  reducer,
} from 'src/features/contribution/redux/recallContribution';

describe('contribution/redux/recallContribution', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by recallContribution', () => {
    expect(recallContribution()).to.have.property('type', CONTRIBUTION_RECALL_CONTRIBUTION_BEGIN);
  });

  it('returns correct action by dismissRecallContributionError', () => {
    expect(dismissRecallContributionError()).to.have.property('type', CONTRIBUTION_RECALL_CONTRIBUTION_DISMISS_ERROR);
  });

  // saga tests
  const generator = doRecallContribution();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches CONTRIBUTION_RECALL_CONTRIBUTION_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: CONTRIBUTION_RECALL_CONTRIBUTION_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches CONTRIBUTION_RECALL_CONTRIBUTION_FAILURE action when failed', () => {
    const generatorForError = doRecallContribution();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: CONTRIBUTION_RECALL_CONTRIBUTION_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type CONTRIBUTION_RECALL_CONTRIBUTION_BEGIN correctly', () => {
    const prevState = { recallContributionPending: false };
    const state = reducer(
      prevState,
      { type: CONTRIBUTION_RECALL_CONTRIBUTION_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.recallContributionPending).to.be.true;
  });

  it('handles action type CONTRIBUTION_RECALL_CONTRIBUTION_SUCCESS correctly', () => {
    const prevState = { recallContributionPending: true };
    const state = reducer(
      prevState,
      { type: CONTRIBUTION_RECALL_CONTRIBUTION_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.recallContributionPending).to.be.false;
  });

  it('handles action type CONTRIBUTION_RECALL_CONTRIBUTION_FAILURE correctly', () => {
    const prevState = { recallContributionPending: true };
    const state = reducer(
      prevState,
      { type: CONTRIBUTION_RECALL_CONTRIBUTION_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.recallContributionPending).to.be.false;
    expect(state.recallContributionError).to.exist;
  });

  it('handles action type CONTRIBUTION_RECALL_CONTRIBUTION_DISMISS_ERROR correctly', () => {
    const prevState = { recallContributionError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CONTRIBUTION_RECALL_CONTRIBUTION_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.recallContributionError).to.be.null;
  });
});