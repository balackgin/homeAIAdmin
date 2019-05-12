import React from 'react';
import { shallow } from 'enzyme';
import { ContributionMsg } from '../../../src/features/messages/ContributionMsg';

describe('messages/ContributionMsg', () => {
  it('renders node with correct class name', () => {
    const props = {
      messages: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ContributionMsg {...props} />
    );

    expect(
      renderedComponent.find('.messages-contribution-msg').length
    ).toBe(1);
  });
});
