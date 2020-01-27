import { useEffect, useReducer } from 'react';
import { Key, useInput } from 'ink';

import { handleUseInput } from './handle-use-input';
import { Branch, fetchBranches } from './fetch-branches';
import { branchIndexFromInput, createCommand, updateSelectedBranches } from './helpers';

import { execAsync } from '../../utils/exec-helper';

export type Command = {
  branch: Branch;
  errorMessage: string | null;
  string: string;
  shouldBeExecuted: boolean;
  type: Mode;
};

export type Mode = 'normal' | 'checkout' | 'delete';

export type AppData = {
  branches: Branch[];
  command: Command | null;
  input: string;
  mode: Mode;
};

export type Action =
  | { type: 'added_input'; input: string }
  | { type: 'confirmed_command' }
  | { type: 'executed_command'; errorMessage?: string }
  | { type: 'fetched_branches'; branches: Branch[] }
  | { type: 'pressed_backspace' }
  | { type: 'switched_mode'; mode: Mode };

const INITIAL_STATE: AppData = {
  branches: [],
  command: null,
  // NOTE: Replace `' '` with `''` when the issue below is fixed.
  // https://github.com/vadimdemedes/ink/issues/241
  input: ' ',
  mode: 'normal',
};

export const reducer = (state: AppData, action: Action): AppData => {
  switch (action.type) {
    case 'added_input': {
      if (state.mode === 'normal') {
        return state;
      }

      const branchIndex = branchIndexFromInput(action.input);
      if (branchIndex === null) {
        return state;
      }

      const nextInput = state.input + action.input;

      const [updatedBranches, selectedBranch] = updateSelectedBranches(state.branches, branchIndex);

      return {
        ...state,
        branches: updatedBranches,
        command: createCommand(selectedBranch, state.mode),
        input: nextInput,
      };
    }

    case 'confirmed_command': {
      return {
        ...state,
        command:
          state.command === null
            ? null
            : {
                ...state.command,
                shouldBeExecuted: true,
              },
      };
    }

    case 'executed_command': {
      const commandType = state.command?.type;
      const nextBranches = state.branches.map(branch => ({
        ...branch,
        isDeleted: branch.isDeleted || (commandType === 'delete' && branch.name === state.command?.branch.name),
        isSelected: false,
      }));

      return {
        ...state,
        branches: nextBranches,
        command:
          state.command && action.errorMessage
            ? {
                ...state.command,
                errorMessage: action.errorMessage,
              }
            : null,
        input: '',
      };
    }

    case 'fetched_branches': {
      return {
        ...state,
        branches: action.branches,
      };
    }

    case 'pressed_backspace': {
      if (state.input === '') return state;

      const nextInput = state.input.slice(0, -1);
      const branchIndex = branchIndexFromInput(nextInput);
      const [updatedBranches, selectedBranch] = updateSelectedBranches(state.branches, branchIndex);

      return {
        ...state,
        branches: updatedBranches,
        command: createCommand(selectedBranch, state.mode),
        input: nextInput,
      };
    }

    case 'switched_mode': {
      const nextMode = action.mode;

      return {
        ...state,
        branches: state.branches.map(branch => ({ ...branch, isSelected: false })),
        command: null,
        input: '',
        mode: nextMode,
      };
    }

    default: {
      throw new Error('Unknown action type.');
    }
  }
};

export const useAppData = (): AppData => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    fetchBranches().then((branches: Branch[]) => {
      dispatch({
        type: 'fetched_branches',
        branches,
      });
    });
  }, []);

  useEffect(() => {
    if (state.command?.shouldBeExecuted) {
      execAsync(state.command.string)
        .then(() => {
          if (state.mode === 'checkout') {
            process.exit(0);
          }

          dispatch({ type: 'executed_command' });
        })
        .catch(res => {
          dispatch({
            type: 'executed_command',
            errorMessage: res.stderr,
          });
        });
    }
  }, [state.command]);

  useInput((keyboardInput: string, key: Key): void => {
    handleUseInput({
      dispatch,
      key,
      keyboardInput,
    });
  });

  return state;
};
