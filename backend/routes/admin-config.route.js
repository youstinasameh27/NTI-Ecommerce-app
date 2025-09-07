const express = require('express');
const router = express.Router();
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');
const backupService = require('../services/backup.service');
const restoreService = require('../services/restore.service');

router.get('/backup',authenticate,authorize('admin'),async(req,res)=>{
  try{
    const r = await backupService.backup();
    res.status(200).json({message:'backup done',data:r});
  }catch(e){
    res.status(500).json({message:'backup failed'});
  }
});

router.post('/restore',authenticate,authorize('admin'),async(req,res)=>{
  try{
    const {folder} = req.body;
    if(!folder) return res.status(400).json({message:'folder required'});
    const r = await restoreService.restore(folder);
    res.status(200).json({message:'restore done',data:r});
  }catch(e){
    res.status(500).json({message:'restore failed'});
  }
});

module.exports = router;
