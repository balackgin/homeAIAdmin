import React from 'react';
import { shallow } from 'enzyme';
import { ResultTab } from '../../../src/features/cases';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ResultTab />);
  expect(renderedComponent.find('.cases-result-tab').length).toBe(1);
});
