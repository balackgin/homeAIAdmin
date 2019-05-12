import React from 'react';
import { shallow } from 'enzyme';
import { ModeTab } from '../../../src/features/cases';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ModeTab />);
  expect(renderedComponent.find('.cases-mode-tab').length).toBe(1);
});
