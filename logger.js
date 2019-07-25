const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.simple(),
  level: 'info',
  transports: [
    new transports.File({ filename: 'lunchly-error.log', level: 'error' }),
    new transports.File({ filename: 'lunchly-combined.log' })
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
