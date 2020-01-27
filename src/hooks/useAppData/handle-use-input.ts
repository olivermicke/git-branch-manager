import { Dispatch } from 'react';
import { Key } from 'ink';

import { Action } from './useAppData';

const isBackspace = (keyboardInput: string): boolean => keyboardInput.charCodeAt(0) === 127;

export const handleUseInput = ({
  dispatch,
  key,
  keyboardInput,
}: {
  dispatch: Dispatch<Action>;
  key: Key;
  keyboardInput: string;
}) => {
  keyboardInput = keyboardInput.toLowerCase();

  if (key.escape || keyboardInput === 'q') {
    process.exit(0);
  }

  if (isBackspace(keyboardInput)) {
    dispatch({ type: 'pressed_backspace' });
    return;
  }

  switch (keyboardInput) {
    case 'c': {
      dispatch({ type: 'switched_mode', mode: 'checkout' });
      return;
    }
    case 'd': {
      dispatch({ type: 'switched_mode', mode: 'delete' });
      return;
    }
    case 'n': {
      dispatch({ type: 'switched_mode', mode: 'normal' });
      return;
    }
    case 'y': {
      dispatch({ type: 'confirmed_command' });
      return;
    }
    default: {
      dispatch({ type: 'added_input', input: keyboardInput });
      return;
    }
  }
};
