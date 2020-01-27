import { daysBetween } from '../../utils/date-helpers';
import { execFormatted } from '../../utils/exec-helper';

export const BRANCH_INFO_SEPARATOR = '◊';
const DAYS_UNTIL_INACTIVE = 7;
const RECENT_BRANCHES_LIMIT = 4;

export type Branch = RawBranch & {
  isCurrent: boolean;
  isDeleted: boolean;
  isInactive: boolean;
  isRecent: boolean;
  isSelected: boolean;
};

type RawBranch = {
  dateOfLastCommit: Date;
  name: string;
};

export const getCurrentBranchName = async (): Promise<string> =>
  (await execFormatted('git name-rev --name-only HEAD'))[0];

export const getRawBranches = async (): Promise<RawBranch[]> =>
  execFormatted(`git branch --format='%(refname:short)${BRANCH_INFO_SEPARATOR}%(committerdate)'`).then(
    (lines: string[]) =>
      lines.map(
        (line): RawBranch => ({
          dateOfLastCommit: new Date(line.split(BRANCH_INFO_SEPARATOR)[1]),
          name: line.split(BRANCH_INFO_SEPARATOR)[0],
        }),
      ),
  );

// https://stackoverflow.com/questions/25095061/how-can-i-get-a-list-of-git-branches-that-ive-recently-checked-out
export const getRecentBranchNames = async (): Promise<string[]> =>
  execFormatted(
    `git reflog | egrep -io "moving from ([^[:space:]]+)" | awk '{ print $3 }' | awk ' !x[$0]++' | egrep -v '^[a-f0-9]{40}$' | head -n${RECENT_BRANCHES_LIMIT}`,
  );

export const fetchBranches = async (): Promise<Branch[]> => {
  const [currentBranchName, rawBranches, recentBranchNames] = await Promise.all([
    getCurrentBranchName(),
    getRawBranches(),
    getRecentBranchNames(),
  ]);

  const branches: Branch[] = rawBranches.map(
    (rawBranch: RawBranch): Branch => ({
      ...rawBranch,
      isCurrent: currentBranchName === rawBranch.name,
      isDeleted: false,
      isInactive: daysBetween(rawBranch.dateOfLastCommit, new Date()) > DAYS_UNTIL_INACTIVE,
      isRecent: recentBranchNames.includes(rawBranch.name),
      isSelected: false,
    }),
  );

  return branches;
};
