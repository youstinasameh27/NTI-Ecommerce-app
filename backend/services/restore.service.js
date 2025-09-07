const { exec } = require('child_process');
const path = require('path');

exports.restore = (folder)=>{
  return new Promise((resolve,reject)=>{
    const dumpPath = path.isAbsolute(folder)? folder : path.join(__dirname,'..','backups',folder);
    const cmd = `mongorestore --uri="${process.env.MONGO_URL}" --drop "${dumpPath}"`;
    exec(cmd,(err)=>{
      if(err) return reject(err);
      resolve({restored: true});
    });
  });
}
