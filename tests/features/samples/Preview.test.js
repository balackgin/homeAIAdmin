import React from 'react';
import { shallow } from 'enzyme';
import { Preview } from '../../../src/features/samples';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Preview />);
  expect(renderedComponent.find('.samples-preview').length).toBe(1);
});
