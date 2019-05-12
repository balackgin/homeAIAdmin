import React from 'react';
import { shallow } from 'enzyme';
import { EditPanel } from '../../../src/features/cases';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<EditPanel />);
  expect(renderedComponent.find('.cases-edit-panel').length).toBe(1);
});
