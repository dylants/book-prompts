import pino, { LoggerOptions } from 'pino';
import config from '../../config';

// https://github.com/pinojs/pino/blob/master/docs/api.md#pinooptions-destination--logger
const options: LoggerOptions = {
  browser: {
    asObject: true,
  },
  // "silent" to disable logging
  level: process.env.NODE_ENV === 'test' ? 'silent' : config.log.level,
};

const logger = pino(options);

export default logger;
