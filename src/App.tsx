import React from 'react';
import { Box } from 'ink';

import { Branches } from './components/Branches';
import { Command } from './components/Command';
import { Controls } from './components/Controls';
import { Mode } from './components/Mode';

import { useAppData } from './hooks/useAppData';

export const App = () => {
  const appData = useAppData();

  return (
    <Box flexDirection='column'>
      <Branches branches={appData.branches} />
      <Box> </Box>
      <Mode input={appData.input} mode={appData.mode} />
      <Command command={appData.command} />
      <Controls command={appData.command} />
    </Box>
  );
};
