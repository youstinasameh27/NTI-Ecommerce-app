module.exports = (req,res,next)=>{
  const page = parseInt(req.query.page||'1',10);
  const limit = parseInt(req.query.limit||'12',10);
  req.paginate = { page: page<1?1:page, limit: limit<1?12:limit };
  next();
}
