import React from 'react';
import { render } from 'ink-testing-library';

import { Branches } from '../Branches';

jest.unmock('../../hooks/useBranchesData');

const useBranchesDataModuleMock = require('../../hooks/useBranchesData');
useBranchesDataModuleMock.useBranchesData = jest.fn();

const useBranchesDataMock: jest.Mock = useBranchesDataModuleMock.useBranchesData;

const MOCKED_BRANCHES_DATA = [
  {
    dateOfLastCommit: new Date('Mon Dec 2 22:40:39 2019 +0100'),
    isCurrent: true,
    isRecent: true,
    name: 'master',
  },
  {
    dateOfLastCommit: new Date('Tue Dec 3 22:40:39 2019 +0100'),
    isCurrent: false,
    isRecent: true,
    name: 'production',
  },
];

describe('Branches', () => {
  it('renders text while loading', () => {
    useBranchesDataMock.mockReturnValue([]);

    const { lastFrame } = render(<Branches />);
    expect(lastFrame()).toEqual('Loading...');
  });

  it('renders branches data correctly', () => {
    useBranchesDataMock.mockReturnValue(MOCKED_BRANCHES_DATA);

    const { lastFrame } = render(<Branches />);
    expect(lastFrame()).toEqual('\u001b[4m\u001b[1mmaster\u001b[22m\u001b[24m\n\u001b[4mproduction\u001b[24m');
  });
});
