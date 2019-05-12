import React from 'react';
import { shallow } from 'enzyme';
import { QuotationInfo } from '../../../src/features/cases';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<QuotationInfo />);
  expect(renderedComponent.find('.cases-quotation-info').length).toBe(1);
});
