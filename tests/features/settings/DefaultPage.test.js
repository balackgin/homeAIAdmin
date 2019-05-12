import React from 'react';
import { shallow } from 'enzyme';
import { DefaultPage } from '../../../src/features/settings/DefaultPage';

describe('settings/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      settings: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.settings-default-page').length
    ).toBe(1);
  });
});
