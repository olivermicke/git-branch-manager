import {
  BRANCH_INFO_SEPARATOR,
  fetchBranches,
  getCurrentBranchName,
  getRawBranches,
  getRecentBranchNames,
} from '../fetch-branches';

jest.unmock('../../../utils/exec-helper');

const execHelperMock = require('../../../utils/exec-helper');
execHelperMock.execFormatted = jest.fn();

const execFormattedMock: jest.Mock = execHelperMock.execFormatted;

const MOCKED_BRANCH_NAME = 'master';
const MOCKED_DATE_STR = 'Mon Dec 2 22:40:39 2019 +0100';

describe('fetchBranches', () => {
  describe('function', () => {
    beforeEach(() => {
      execFormattedMock.mockResolvedValueOnce(['production']);
      execFormattedMock.mockResolvedValueOnce([`${MOCKED_BRANCH_NAME}${BRANCH_INFO_SEPARATOR}${MOCKED_DATE_STR}`]);
      execFormattedMock.mockResolvedValueOnce([MOCKED_BRANCH_NAME, 'production']);
    });

    it('returns the expected result', async () => {
      expect(await fetchBranches()).toEqual([
        {
          dateOfLastCommit: new Date(MOCKED_DATE_STR),
          isCurrent: false,
          isDeleted: false,
          isInactive: true,
          isRecent: true,
          isSelected: false,
          name: 'master',
        },
      ]);
    });
  });

  describe('helpers', () => {
    test('getCurrentBranchName works correctly', async () => {
      execFormattedMock.mockResolvedValueOnce(['master']);

      const name = await getCurrentBranchName();
      expect(name).toEqual('master');
    });

    test('getRawBranchesInfo works correctly', async () => {
      const mockedBranchName = 'master';

      execFormattedMock.mockResolvedValueOnce([`${mockedBranchName}${BRANCH_INFO_SEPARATOR}${MOCKED_DATE_STR}`]);

      const branchesInfo = await getRawBranches();
      expect(branchesInfo).toEqual([{ dateOfLastCommit: new Date(MOCKED_DATE_STR), name: mockedBranchName }]);
    });

    test('getRecentBranchNames works correctly', async () => {
      execFormattedMock.mockResolvedValueOnce(['master', 'production']);

      const names = await getRecentBranchNames();
      expect(names).toEqual(['master', 'production']);
    });
  });
});
