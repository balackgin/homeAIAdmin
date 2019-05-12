import React from 'react';
import { shallow } from 'enzyme';
import { DefaultPage } from '../../../src/features/contribution/DefaultPage';

describe('contribution/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      contribution: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.contribution-default-page').length
    ).toBe(1);
  });
});
