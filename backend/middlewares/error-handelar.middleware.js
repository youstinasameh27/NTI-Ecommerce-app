const logger = require('../utils/logger.utils');

module.exports = (err,req,res,next)=>{
  const status = err.statusCode || 500;
  const message = err.message || 'server error';
  logger.error(message);
  res.status(status).json({message});
}
