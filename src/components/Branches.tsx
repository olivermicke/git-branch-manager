import React from 'react';
import { Box, Text } from 'ink';

import { useBranchesData } from '../hooks/useBranchesData';

export const Branches = () => {
  const branches = useBranchesData();

  if (branches.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box flexDirection='column'>
      {branches.map(({ isCurrent, isRecent, name }) => (
        <Text bold={isCurrent} key={name} underline={isRecent}>
          {name}
        </Text>
      ))}
    </Box>
  );
};
