import { Branch } from './fetch-branches';
import { Command, Mode } from './useAppData';

export const branchIndexFromInput = (input: string): number | null => {
  const branchIndex = parseInt(input, 10);
  if (isNaN(branchIndex)) return null;
  return branchIndex;
};

export const createCommand = (branch: Branch | null, mode: Mode): Command | null => {
  if (!branch || mode === 'normal') return null;

  return {
    branch,
    errorMessage: null,
    shouldBeExecuted: false,
    string: `git ${mode === 'checkout' ? 'checkout' : 'branch -D'} ${branch.name}`,
    type: mode,
  };
};

export const updateSelectedBranches = (branches: Branch[], branchIndex: number | null): [Branch[], Branch | null] => {
  const updatedBranches = branches.map((branch, index) => ({
    ...branch,
    isSelected: index === branchIndex,
  }));

  const selectedBranch: Branch | null = branchIndex !== null ? updatedBranches[branchIndex] || null : null;

  return [updatedBranches, selectedBranch];
};
