import React from 'react';
import { render } from 'ink-testing-library';

import { HelloWorld } from '../index';

// NOTE: Test if TS is transpiled.
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const foo: boolean = true;

describe('jest', () => {
  it('works', () => {
    expect(foo).toEqual(true);
  });
});

describe('ink', () => {
  it('works', () => {
    const { lastFrame } = render(<HelloWorld />);
    expect(lastFrame()).toEqual('Hello World!');
  });
});
