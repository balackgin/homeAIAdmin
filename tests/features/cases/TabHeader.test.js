import React from 'react';
import { shallow } from 'enzyme';
import { TabHeader } from '../../../src/features/cases';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<TabHeader />);
  expect(renderedComponent.find('.cases-tab-header').length).toBe(1);
});
