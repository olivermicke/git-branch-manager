import { Branch } from '../fetch-branches';
import { AppData, reducer } from '../useAppData';

const MOCKED_BRANCH: Branch = {
  dateOfLastCommit: new Date(),
  isCurrent: false,
  isDeleted: false,
  isInactive: false,
  isRecent: false,
  isSelected: false,
  name: 'foo',
};

const MOCKED_COMMAND: AppData['command'] = {
  branch: MOCKED_BRANCH,
  errorMessage: 'foo',
  shouldBeExecuted: true,
  string: `git branch -D ${MOCKED_BRANCH.name}`,
  type: 'delete',
};

const MOCKED_STATE: AppData = {
  branches: [],
  command: null,
  input: ' ',
  mode: 'normal',
};

describe('useAppData reducer', () => {
  describe('added_input', () => {
    it('adds input', () => {
      const result = reducer({ ...MOCKED_STATE, input: '0', mode: 'checkout' }, { type: 'added_input', input: '9' });
      expect(result.input).toEqual('09');
    });

    it('creates command if possible', () => {
      const result = reducer(
        { ...MOCKED_STATE, branches: [MOCKED_BRANCH], input: '', mode: 'checkout' },
        { type: 'added_input', input: '0' },
      );
      expect(result.command).toEqual({
        branch: { ...MOCKED_BRANCH, isSelected: true },
        errorMessage: null,
        shouldBeExecuted: false,
        string: `git checkout ${MOCKED_BRANCH.name}`,
        type: 'checkout',
      });
    });

    it('ignores input if in normal mode', () => {
      const initialInput = '0';
      const result = reducer(
        { ...MOCKED_STATE, input: initialInput, mode: 'normal' },
        { type: 'added_input', input: '9' },
      );
      expect(result.input).toEqual(initialInput);
    });

    it('ignores non-numeric inputs', () => {
      const initialInput = '0';

      ['a', '!', 'ß', '◊'].forEach(input => {
        const result = reducer(
          { ...MOCKED_STATE, input: initialInput, mode: 'checkout' },
          { type: 'added_input', input },
        );
        expect(result.input).toEqual(initialInput);
      });
    });

    it('resets all necessary command properties', () => {
      const result = reducer(
        { ...MOCKED_STATE, branches: [MOCKED_BRANCH], command: MOCKED_COMMAND, input: '', mode: MOCKED_COMMAND.type },
        { type: 'added_input', input: '0' },
      );
      expect(result.command?.errorMessage).toEqual(null);
      expect(result.command?.shouldBeExecuted).toEqual(false);
    });

    it('resets command when no branch is selected anymore', () => {
      const result = reducer(
        { ...MOCKED_STATE, command: MOCKED_COMMAND, input: '190', mode: MOCKED_COMMAND.type },
        { type: 'added_input', input: '9' },
      );
      expect(result.command).toEqual(null);
    });
  });

  describe('confirmed_command', () => {
    it('sets "should_exec_command" to null if it should', () => {
      const result = reducer({ ...MOCKED_STATE, command: null }, { type: 'confirmed_command' });
      expect(result.command).toEqual(null);
    });

    it('sets "should_exec_command" to true if it should', () => {
      const result = reducer({ ...MOCKED_STATE, command: MOCKED_COMMAND }, { type: 'confirmed_command' });
      expect(result.command?.shouldBeExecuted).toEqual(true);
    });
  });

  describe('executed_command', () => {
    it('deselects all branches', () => {
      const result = reducer(
        { ...MOCKED_STATE, branches: [{ ...MOCKED_BRANCH, isSelected: true }] },
        { type: 'executed_command' },
      );
      expect(result.branches[0].isSelected).toEqual(false);
    });

    it('sets branch to "deleted" if it should', () => {
      const result = reducer(
        {
          ...MOCKED_STATE,
          branches: [MOCKED_BRANCH],
          command: MOCKED_COMMAND,
        },
        { type: 'executed_command' },
      );
      expect(result.branches[0].isDeleted).toEqual(true);
    });

    it('sets errorMessage if it should', () => {
      const result = reducer(
        { ...MOCKED_STATE, command: MOCKED_COMMAND },
        { type: 'executed_command', errorMessage: 'foo' },
      );
      expect(result.command?.errorMessage).toEqual('foo');
    });

    it('resets all necessary props', () => {
      const result = reducer(
        {
          ...MOCKED_STATE,
          command: MOCKED_COMMAND,
          input: '09',
        },
        { type: 'executed_command' },
      );
      expect(result.command).toEqual(null);
      expect(result.input).toEqual('');
    });
  });

  describe('fetched_branches', () => {
    it('sets branches', () => {
      const result = reducer(MOCKED_STATE, { type: 'fetched_branches', branches: [MOCKED_BRANCH] });
      expect(result.branches).toEqual([MOCKED_BRANCH]);
    });
  });

  describe('pressed_backspace', () => {
    it('returns just the state when there is no input', () => {
      const result = reducer({ ...MOCKED_STATE, input: '' }, { type: 'pressed_backspace' });
      expect(result.input).toEqual('');
    });

    it('creates command if possible', () => {
      const result = reducer(
        { ...MOCKED_STATE, branches: [MOCKED_BRANCH], input: '09', mode: 'checkout' },
        { type: 'pressed_backspace' },
      );
      expect(result.command).toEqual({
        branch: { ...MOCKED_BRANCH, isSelected: true },
        errorMessage: null,
        shouldBeExecuted: false,
        string: `git checkout ${MOCKED_BRANCH.name}`,
        type: 'checkout',
      });
    });

    it('deletes last input character', () => {
      const result = reducer({ ...MOCKED_STATE, input: '09' }, { type: 'pressed_backspace' });
      expect(result.input).toEqual('0');
    });

    it('resets all necessary props', () => {
      const result = reducer({ ...MOCKED_STATE, command: MOCKED_COMMAND }, { type: 'pressed_backspace' });
      expect(result.command).toEqual(null);
    });
  });

  describe('switched_mode', () => {
    it('switches to the correct mode', () => {
      const result = reducer({ ...MOCKED_STATE, mode: 'normal' }, { type: 'switched_mode', mode: 'delete' });
      expect(result.mode).toEqual('delete');
    });

    it('deselects all branches', () => {
      const result = reducer(
        { ...MOCKED_STATE, branches: [{ ...MOCKED_BRANCH, isSelected: true }] },
        { type: 'switched_mode', mode: 'delete' },
      );
      expect(result.branches[0].isSelected).toEqual(false);
    });

    it('resets all necessary props', () => {
      const result = reducer(
        {
          ...MOCKED_STATE,
          command: MOCKED_COMMAND,
          input: 'bar',
        },
        { type: 'switched_mode', mode: 'delete' },
      );
      expect(result.command).toEqual(null);
      expect(result.input).toEqual('');
    });
  });
});
