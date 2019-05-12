import React from 'react';
import { shallow } from 'enzyme';
import { LoginForm } from '../../../src/features/signup';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<LoginForm />);
  expect(renderedComponent.find('.signup-login-form').length).toBe(1);
});
