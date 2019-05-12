import React from 'react';
import { shallow } from 'enzyme';
import { CollapseTable } from '../../../src/features/cases';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<CollapseTable />);
  expect(renderedComponent.find('.cases-collapse-table').length).toBe(1);
});
