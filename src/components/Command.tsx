import React from 'react';
import { Box, Color } from 'ink';

import { AppData } from '../hooks/useAppData';

type Props = {
  command: AppData['command'];
};

export const Command = ({ command }: Props) => (
  <Box flexDirection='column'>
    <Color bgBlack white>
      {command ? `$ ${command.string}` : ' '}
    </Color>
    <Color red>{command?.errorMessage}</Color>
  </Box>
);
