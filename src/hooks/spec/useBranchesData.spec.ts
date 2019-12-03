import { act, renderHook } from '@testing-library/react-hooks';

import {
  BRANCH_INFO_SEPARATOR,
  getCurrentBranchName,
  getRawBranches,
  getRecentBranchNames,
  useBranchesData,
} from '../useBranchesData';

jest.unmock('../../utils/exec-helper');

const execHelperMock = require('../../utils/exec-helper');
execHelperMock.execFormatted = jest.fn();

const execFormattedMock: jest.Mock = execHelperMock.execFormatted;

describe('useBranchesData', () => {
  describe('hook', () => {
    const mockedDateStr = 'Mon Dec 2 22:40:39 2019 +0100';

    beforeEach(() => {
      const mockedBranchName = 'master';

      execFormattedMock.mockResolvedValueOnce(['production']);
      execFormattedMock.mockResolvedValueOnce([`${mockedBranchName}${BRANCH_INFO_SEPARATOR}${mockedDateStr}`]);
      execFormattedMock.mockResolvedValueOnce([mockedBranchName, 'production']);
    });

    it('initially renders empty array', async () => {
      const { result } = renderHook(() => useBranchesData());

      await act(async () => {
        expect(result.current).toEqual([]);
      });
    });

    it('returns fetched and normalised branches data', async () => {
      const { result } = renderHook(() => useBranchesData());

      await act(async () => {});

      await act(async () => {
        expect(result.current).toEqual([
          {
            dateOfLastCommit: new Date(mockedDateStr),
            isCurrent: false,
            isRecent: true,
            name: 'master',
          },
        ]);
      });
    });
  });

  describe('helper', () => {
    test('getCurrentBranchName works correctly', async () => {
      execFormattedMock.mockResolvedValueOnce(['master']);

      const name = await getCurrentBranchName();
      expect(name).toEqual('master');
    });

    test('getRawBranchesInfo works correctly', async () => {
      const mockedBranchName = 'master';
      const mockedDateStr = 'Mon Dec 2 22:40:39 2019 +0100';

      execFormattedMock.mockResolvedValueOnce([`${mockedBranchName}${BRANCH_INFO_SEPARATOR}${mockedDateStr}`]);

      const branchesInfo = await getRawBranches();
      expect(branchesInfo).toEqual([{ dateOfLastCommit: new Date(mockedDateStr), name: mockedBranchName }]);
    });

    test('getRecentBranchNames works correctly', async () => {
      execFormattedMock.mockResolvedValueOnce(['master', 'production']);

      const names = await getRecentBranchNames();
      expect(names).toEqual(['master', 'production']);
    });
  });
});
