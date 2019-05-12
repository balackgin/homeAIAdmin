import React from 'react';
import { shallow } from 'enzyme';
import { Edit } from '../../../src/features/cases/Edit';

describe('cases/Edit', () => {
  it('renders node with correct class name', () => {
    const props = {
      cases: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Edit {...props} />
    );

    expect(
      renderedComponent.find('.cases-edit').length
    ).toBe(1);
  });
});
