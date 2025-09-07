const Order = require('../models/order.model');

exports.sales=async(req,res)=>{
  const {startDate,endDate} = req.query;
  const match = {};
  if(startDate || endDate){
    match.createdAt = {};
    if(startDate) match.createdAt.$gte = new Date(startDate);
    if(endDate) match.createdAt.$lte = new Date(endDate);
  }
  const pipeline = [
    {$match: match},
    {$group:{_id:null, orders:{$sum:1}, revenue:{$sum:'$totals.grandTotal'}}}
  ];
  const r = await Order.aggregate(pipeline);
  res.status(200).json({message:'sales',data:r[0]||{orders:0,revenue:0}});
}

exports.products=async(req,res)=>{
  const {startDate,endDate} = req.query;
  const match = {};
  if(startDate || endDate){
    match.createdAt = {};
    if(startDate) match.createdAt.$gte = new Date(startDate);
    if(endDate) match.createdAt.$lte = new Date(endDate);
  }
  const pipeline = [
    {$match: match},
    {$unwind:'$items'},
    {$group:{_id:'$items.product', qty:{$sum:'$items.qty'}, revenue:{$sum:{$multiply:['$items.price','$items.qty']}}}},
    {$sort:{qty:-1}}
  ];
  const list = await Order.aggregate(pipeline);
  res.status(200).json({message:'products',data:list});
}
