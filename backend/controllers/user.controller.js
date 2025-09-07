const User = require('../models/user.model');
const catchAsync= require('../utils/catch-async.utils');

exports.getUsers = catchAsync(async (req,res)=>{
  const users = await User.find().select('-password');
  res.status(200).json({message:'user data',data:users});
});

exports.createUser = (role)=>{
  return catchAsync(async(req,res)=>{
    const {name,password,email,phone,address} = req.body;
    const user = await User.create({name,password,email,phone,address,role});
    res.status(201).json({message:`${role} created`,data:{id:user._id,name:user.name,email:user.email,role:user.role}})
  })
}
