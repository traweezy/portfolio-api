// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path';
import loggerConfig from './logger';
import { version } from '../../package.json';

// eslint-disable-next-line unicorn/prefer-module
export const rootDir = path.join(__dirname, '..');

export const config: Partial<TsED.Configuration> = {
  version,
  rootDir,
  logger: loggerConfig,
};
