import React from 'react';
import { shallow } from 'enzyme';
import { Preview } from '../../../src/features/operator';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Preview />);
  expect(renderedComponent.find('.operator-preview').length).toBe(1);
});
