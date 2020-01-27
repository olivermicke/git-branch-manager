import { exec } from 'child_process';
import { promisify } from 'util';

const init = <T>(arr: T[]): T[] => arr.slice(0, -1);

export const execAsync = promisify(exec);

export const execFormatted = async (command: string): Promise<string[]> =>
  init((await execAsync(command)).stdout.split('\n'));
