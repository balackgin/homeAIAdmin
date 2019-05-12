import React from 'react';
import { shallow } from 'enzyme';
import { Card } from '../../../src/features/contribution';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Card />);
  expect(renderedComponent.find('.samples-card').length).toBe(1);
});
