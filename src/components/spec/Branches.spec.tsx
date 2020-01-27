import React from 'react';
import { render } from 'ink-testing-library';

import { Branches } from '../Branches';

describe('Branches', () => {
  it('renders text while loading', () => {
    const { lastFrame } = render(<Branches branches={[]} />);
    expect(lastFrame()).toEqual('Loading...');
  });
});
