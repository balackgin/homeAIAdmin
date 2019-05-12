import React from 'react';
import { shallow } from 'enzyme';
import { Quotation } from '../../../src/features/cases/Quotation';

describe('cases/Quotation', () => {
  it('renders node with correct class name', () => {
    const props = {
      cases: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Quotation {...props} />
    );

    expect(
      renderedComponent.find('.cases-quotation').length
    ).toBe(1);
  });
});
