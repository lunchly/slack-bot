const { createLogger, format, transports } = require('winston');
const isProductionEnv = require('./validators/is-production');

const logLevel = !isProductionEnv() && process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
const logger = createLogger({
  format: format.simple(),
  level: logLevel,
  transports: [
    new transports.File({ filename: 'lunchly-error.log', level: 'error' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger;
