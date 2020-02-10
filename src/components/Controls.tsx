import React from 'react';
import { Text } from 'ink';

type Props = { hasCommand: boolean };

const COMMAND_CONTROLS = `'y': execute | 'n' cancel | 'q': quit`;
const MODE_CONTROLS = `'c': checkout | 'd': delete | 'n': normal | 'q': quit`;

export const Controls = ({ hasCommand }: Props) => <Text>{hasCommand ? COMMAND_CONTROLS : MODE_CONTROLS}</Text>;
