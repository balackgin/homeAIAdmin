import React from 'react';
import { shallow } from 'enzyme';
import { List } from '../../../src/features/project/List';

describe('project/List', () => {
  it('renders node with correct class name', () => {
    const props = {
      project: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <List {...props} />
    );

    expect(
      renderedComponent.find('.project-list').length
    ).toBe(1);
  });
});
