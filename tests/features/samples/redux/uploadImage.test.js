import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  SAMPLES_UPLOAD_IMAGE_BEGIN,
  SAMPLES_UPLOAD_IMAGE_SUCCESS,
  SAMPLES_UPLOAD_IMAGE_FAILURE,
  SAMPLES_UPLOAD_IMAGE_DISMISS_ERROR,
} from 'src/features/samples/redux/constants';

import {
  uploadImage,
  dismissUploadImageError,
  doUploadImage,
  reducer,
} from 'src/features/samples/redux/uploadImage';

describe('samples/redux/uploadImage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by uploadImage', () => {
    expect(uploadImage()).to.have.property('type', SAMPLES_UPLOAD_IMAGE_BEGIN);
  });

  it('returns correct action by dismissUploadImageError', () => {
    expect(dismissUploadImageError()).to.have.property('type', SAMPLES_UPLOAD_IMAGE_DISMISS_ERROR);
  });

  // saga tests
  const generator = doUploadImage();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches SAMPLES_UPLOAD_IMAGE_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: SAMPLES_UPLOAD_IMAGE_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches SAMPLES_UPLOAD_IMAGE_FAILURE action when failed', () => {
    const generatorForError = doUploadImage();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: SAMPLES_UPLOAD_IMAGE_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type SAMPLES_UPLOAD_IMAGE_BEGIN correctly', () => {
    const prevState = { uploadImagePending: false };
    const state = reducer(
      prevState,
      { type: SAMPLES_UPLOAD_IMAGE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.uploadImagePending).to.be.true;
  });

  it('handles action type SAMPLES_UPLOAD_IMAGE_SUCCESS correctly', () => {
    const prevState = { uploadImagePending: true };
    const state = reducer(
      prevState,
      { type: SAMPLES_UPLOAD_IMAGE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.uploadImagePending).to.be.false;
  });

  it('handles action type SAMPLES_UPLOAD_IMAGE_FAILURE correctly', () => {
    const prevState = { uploadImagePending: true };
    const state = reducer(
      prevState,
      { type: SAMPLES_UPLOAD_IMAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.uploadImagePending).to.be.false;
    expect(state.uploadImageError).to.exist;
  });

  it('handles action type SAMPLES_UPLOAD_IMAGE_DISMISS_ERROR correctly', () => {
    const prevState = { uploadImageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SAMPLES_UPLOAD_IMAGE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.uploadImageError).to.be.null;
  });
});