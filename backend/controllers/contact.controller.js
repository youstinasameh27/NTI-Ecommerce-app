const Contact = require('../models/contact.model');

exports.submit=async(req,res)=>{
  const {name,email,phone,category,message} = req.body;
  const c = await Contact.create({name,email,phone,category,message});
  res.status(201).json({message:'received',data:c});
}
exports.list=async(req,res)=>{
  const list = await Contact.find().sort({createdAt:-1});
  res.status(200).json({message:'contacts',data:list});
}
exports.markHandled=async(req,res)=>{
  const c = await Contact.findByIdAndUpdate(req.params.id,{handled:true},{new:true});
  res.status(200).json({message:'updated',data:c});
}
