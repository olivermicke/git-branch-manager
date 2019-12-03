import { useState } from 'react';
import { Key, useInput } from 'ink';

import { handleUseInput } from './handleUseInput';

export type ModeType = 'normal' | 'checkout' | 'delete';

export const useModeInput = (): [ModeType, string] => {
  const [mode, setMode] = useState<ModeType>('normal');
  // NOTE: Replace `' '` with `''` when the issue below is fixed.
  // https://github.com/vadimdemedes/ink/issues/241
  const [input, setInput] = useState<string>(' ');

  // NOTE: This handler is in a separate file to allow better mocking/testing.
  useInput((keyboardInput: string, key: Key): void => {
    handleUseInput({
      keyboardInput,
      key,
      input,
      setInput,
      mode,
      setMode,
    });
  });

  return [mode, input];
};
