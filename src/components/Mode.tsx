import React from 'react';
import { Box, Color, Text } from 'ink';

import { AppData } from '../hooks/useAppData';

type Props = {
  input: AppData['input'];
  mode: AppData['mode'];
};

export const Mode = ({ input, mode }: Props) => (
  <Box flexDirection='row'>
    {mode === 'normal' ? (
      <Box> </Box>
    ) : (
      <>
        <Color bgGreen={mode === 'checkout'} bgRed={mode === 'delete'} black>
          <Box flexDirection='row'> {mode} </Box>
        </Color>
        <Text> {input || ''}</Text>
      </>
    )}
  </Box>
);
