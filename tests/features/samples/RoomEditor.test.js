import React from 'react';
import { shallow } from 'enzyme';
import { RoomEditor } from '../../../src/features/samples';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<RoomEditor />);
  expect(renderedComponent.find('.samples-room-editor').length).toBe(1);
});
