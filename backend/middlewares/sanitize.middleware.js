const sanitizeHtml = require('sanitize-html');

const sanitizeValue = (v)=>{
  if(typeof v==='string') return sanitizeHtml(v,{allowedTags:[],allowedAttributes:{}});
  if(Array.isArray(v)) return v.map(sanitizeValue);
  if(v && typeof v==='object'){
    const r={}; Object.keys(v).forEach(k=> r[k]=sanitizeValue(v[k])); return r;
  }
  return v;
}

module.exports = (req,res,next)=>{
  if(req.body) req.body = sanitizeValue(req.body);
  next();
}
