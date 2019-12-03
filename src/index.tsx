import React from 'react';
import { Box, render } from 'ink';

import { Branches } from './components/Branches';
import { Mode } from './components/Mode';

render(
  <Box flexDirection='column'>
    <Branches />
    <Box> </Box>
    <Mode />
  </Box>,
);
