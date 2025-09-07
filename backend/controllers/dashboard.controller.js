const Order = require('../models/order.model');
const Testimonial = require('../models/testimonial.model');

exports.overview=async(req,res)=>{
  const pendingCount = await Order.countDocuments({status:'pending'});
  const pending = await Order.find({status:'pending'}).sort({createdAt:-1}).limit(5).select('_id user totals createdAt');
  const unseenCount = await Testimonial.countDocuments({isApproved:false});
  const unseen = await Testimonial.find({isApproved:false}).sort({createdAt:-1}).limit(5).select('_id userId createdAt');
  const start = new Date(); start.setHours(0,0,0,0);
  const today = await Order.aggregate([
    {$match:{createdAt:{$gte:start}}},
    {$group:{_id:null, orders:{$sum:1}, revenue:{$sum:'$totals.grandTotal'}}}
  ]);
  res.status(200).json({message:'overview',data:{
    pendingOrdersCount:pendingCount,
    pendingOrders:pending,
    unseenTestimonialsCount:unseenCount,
    unseenTestimonials:unseen,
    todayStats: today[0]||{orders:0,revenue:0}
  }});
}
