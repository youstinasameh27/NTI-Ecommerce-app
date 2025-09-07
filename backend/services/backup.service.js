const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.backup = ()=>{
  return new Promise((resolve,reject)=>{
    const dir = path.join(__dirname,'..','backups');
    if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
    const ts = new Date().toISOString().replace(/[:.]/g,'-');
    const out = path.join(dir,`dump-${ts}`);
    const cmd = `mongodump --uri="${process.env.MONGO_URL}" --out="${out}"`;
    exec(cmd,(err)=>{
      if(err) return reject(err);
      resolve({path: out});
    });
  });
}
