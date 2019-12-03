import { Key } from 'ink';

import { ModeType } from './useModeInput';

const isBackspace = (keyboardInput: string): boolean => keyboardInput.charCodeAt(0) === 127;

export const handleUseInput = ({
  key,
  keyboardInput,
  input,
  setInput,
  mode,
  setMode,
}: {
  key: Key;
  keyboardInput: string;
  input: string;
  setInput: (input: string) => void;
  mode: ModeType;
  setMode: (mode: ModeType) => void;
}) => {
  keyboardInput = keyboardInput.toLowerCase();

  if (key.escape || keyboardInput === 'q') {
    process.exit(0);
  }

  if (isBackspace(keyboardInput)) {
    if (input !== '') {
      setInput(input.slice(0, -1));
    }
    return;
  }

  const setNormalMode = () => {
    setInput(' ');
    setMode('normal');
  };

  switch (keyboardInput) {
    case 'c':
      if (mode === 'checkout') {
        setNormalMode();
      } else {
        setMode('checkout');
      }
      return;
    case 'd':
      if (mode === 'delete') {
        setNormalMode();
      } else {
        setMode('delete');
      }
      return;
    case 'n':
      setNormalMode();
      return;
    default:
      if (parseInt(keyboardInput, 10)) {
        setInput(input + keyboardInput);
      }
      return;
  }
};
