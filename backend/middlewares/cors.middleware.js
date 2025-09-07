const cors = require('cors');

const parse = (val)=>{
  if(!val) return [];
  return val.split(',').map(s=>s.trim()).filter(Boolean);
}
const allowed = parse(process.env.ALLOWED_ORIGINS);

module.exports = cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowed.length===0) return callback(null, true);
    if(allowed.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
});
