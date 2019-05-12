import React from 'react';
import { shallow } from 'enzyme';
import { Library } from '../../../src/features/cases/Library';

describe('cases/Library', () => {
  it('renders node with correct class name', () => {
    const props = {
      cases: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Library {...props} />
    );

    expect(
      renderedComponent.find('.cases-library').length
    ).toBe(1);
  });
});
