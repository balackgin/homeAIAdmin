import React from 'react';
import { shallow } from 'enzyme';
import { CaseLib } from '../../../src/features/samples';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<CaseLib />);
  expect(renderedComponent.find('.samples-case-lib').length).toBe(1);
});
