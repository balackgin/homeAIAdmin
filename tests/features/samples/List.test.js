import React from 'react';
import { shallow } from 'enzyme';
import { List } from '../../../src/features/samples/List';

describe('samples/List', () => {
  it('renders node with correct class name', () => {
    const props = {
      contribution: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <List {...props} />
    );

    expect(
      renderedComponent.find('.samples-list').length
    ).toBe(1);
  });
});
