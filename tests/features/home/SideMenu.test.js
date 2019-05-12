import React from 'react';
import { shallow } from 'enzyme';
import { SideMenu } from '../../../src/features/home/SideMenu';

describe('home/SideMenu', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <SideMenu {...props} />
    );

    expect(
      renderedComponent.find('.home-side-menu').length
    ).toBe(1);
  });
});
