import React from 'react';
import { shallow } from 'enzyme';
import { Card } from '../../../src/features/cases';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Card />);
  expect(renderedComponent.find('.cases-card').length).toBe(1);
});
