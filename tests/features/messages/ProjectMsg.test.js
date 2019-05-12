import React from 'react';
import { shallow } from 'enzyme';
import { ProjectMsg } from '../../../src/features/messages/ProjectMsg';

describe('messages/ProjectMsg', () => {
  it('renders node with correct class name', () => {
    const props = {
      messages: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ProjectMsg {...props} />
    );

    expect(
      renderedComponent.find('.messages-project-msg').length
    ).toBe(1);
  });
});
