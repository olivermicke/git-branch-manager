import React from 'react';
import { Box, Color, Text } from 'ink';

import { useModeInput } from '../hooks/useModeInput/useModeInput';

export const Mode = () => {
  const [mode, input] = useModeInput();

  return (
    <Box flexDirection='row'>
      {mode === 'normal' ? (
        <Box> </Box>
      ) : (
        <>
          <Color bgGreen={mode === 'checkout'} bgRed={mode === 'delete'} black>
            <Box flexDirection='row'> {mode} </Box>
          </Color>
          <Text>{input || ''}</Text>
        </>
      )}
    </Box>
  );
};
