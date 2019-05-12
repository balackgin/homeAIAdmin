import React from 'react';
import { shallow } from 'enzyme';
import { CheckList } from '../../../src/features/sample-check/CheckList';

describe('sample-check/CheckList', () => {
  it('renders node with correct class name', () => {
    const props = {
      sampleCheck: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <CheckList {...props} />
    );

    expect(
      renderedComponent.find('.sample-check-check-list').length
    ).toBe(1);
  });
});
