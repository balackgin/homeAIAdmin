import React from 'react';
import { shallow } from 'enzyme';
import { OperatCases } from '../../../src/features/operator/OperatCases';

describe('operator/OperatCases', () => {
  it('renders node with correct class name', () => {
    const props = {
      operator: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <OperatCases {...props} />
    );

    expect(
      renderedComponent.find('.operator-operat-cases').length
    ).toBe(1);
  });
});
