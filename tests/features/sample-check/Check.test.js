import React from 'react';
import { shallow } from 'enzyme';
import { Check } from '../../../src/features/sample-check/Check';

describe('sample-check/Check', () => {
  it('renders node with correct class name', () => {
    const props = {
      sampleCheck: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Check {...props} />
    );

    expect(
      renderedComponent.find('.sample-check-check').length
    ).toBe(1);
  });
});
