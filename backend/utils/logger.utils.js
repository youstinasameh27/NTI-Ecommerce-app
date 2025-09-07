const { createLogger, transports, format } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: path.join(__dirname,'..','logs','error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname,'..','logs','combined.log') })
  ]
});

module.exports = logger;
