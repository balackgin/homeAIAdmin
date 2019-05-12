import React from 'react';
import { shallow } from 'enzyme';
import { SignupPage } from '../../../src/features/signup/SignupPage';

describe('signup/SignupPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      signup: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <SignupPage {...props} />
    );

    expect(
      renderedComponent.find('.signup-signup-page').length
    ).toBe(1);
  });
});
