import React from 'react';
import { shallow } from 'enzyme';
import { List } from '../../../src/features/messages';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<List />);
  expect(renderedComponent.find('.messages-list').length).toBe(1);
});
