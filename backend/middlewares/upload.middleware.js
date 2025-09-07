const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, path.join(__dirname,'..','uploads')); },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_')); }
});

const fileFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image/')) cb(null,true);
  else cb(null,false);
}

module.exports = multer({ storage, fileFilter, limits:{ fileSize: 2*1024*1024 } });
