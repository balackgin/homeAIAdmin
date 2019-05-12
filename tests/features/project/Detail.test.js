import React from 'react';
import { shallow } from 'enzyme';
import { Detail } from '../../../src/features/project/Detail';

describe('project/Detail', () => {
  it('renders node with correct class name', () => {
    const props = {
      project: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Detail {...props} />
    );

    expect(
      renderedComponent.find('.project-detail').length
    ).toBe(1);
  });
});
