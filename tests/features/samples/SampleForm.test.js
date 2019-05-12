import React from 'react';
import { shallow } from 'enzyme';
import { SampleForm } from '../../../src/features/samples/SampleForm';

describe('samples/SampleForm', () => {
  it('renders node with correct class name', () => {
    const props = {
      samples: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <SampleForm {...props} />
    );

    expect(
      renderedComponent.find('.samples-sample-form').length
    ).toBe(1);
  });
});
