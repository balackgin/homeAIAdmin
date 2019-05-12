import React from 'react';
import { shallow } from 'enzyme';
import { RegisterForm } from '../../../src/features/signup';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<RegisterForm />);
  expect(renderedComponent.find('.signup-register-form').length).toBe(1);
});
