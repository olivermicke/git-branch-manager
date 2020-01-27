import React from 'react';
import { Text } from 'ink';

import { AppData } from '../hooks/useAppData';

type Props = { command: AppData['command'] };

const COMMAND_CONTROLS = `'y': execute | 'n' cancel | 'q': quit`;
const MODE_CONTROLS = `'c': checkout | 'd': delete | 'n': normal | 'q': quit`;

export const Controls = ({ command }: Props) => <Text>{command ? COMMAND_CONTROLS : MODE_CONTROLS}</Text>;
