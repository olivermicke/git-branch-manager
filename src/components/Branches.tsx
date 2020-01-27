import React from 'react';
import { Box, Color, Text } from 'ink';

import { AppData } from '../hooks/useAppData';

type Props = {
  branches: AppData['branches'];
};

export const Branches = ({ branches }: Props) => {
  if (branches.length === 0) {
    return <Text>Loading...</Text>;
  }

  const numOfDigits = String(branches.length).length;

  return (
    <Box flexDirection='column'>
      {branches.map(({ isCurrent, isDeleted, isInactive, isRecent, isSelected, name }, index) => (
        <Color bold={isCurrent} inverse={isSelected} italic={isDeleted} key={name} underline={isRecent && !isDeleted}>
          {String(index).padEnd(numOfDigits, ' ')} {!isDeleted && name}
          {isInactive && !isDeleted && ' [inactive]'}
        </Color>
      ))}
    </Box>
  );
};
