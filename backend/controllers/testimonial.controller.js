const mongoose = require('mongoose');
const Testimonial = require('../models/testimonial.model');
const Order = require('../models/order.model');


exports.add = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, orderId, rating, content } = req.body;

    if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: 'invalid productId or orderId' });
    }

    const order = await Order.findById(orderId).lean();
    if (!order) return res.status(404).json({ message: 'order not found' });
    if (String(order.user) !== String(userId)) return res.status(403).json({ message: 'not your order' });

    // allow rating only after delivery/received
    const allowedStatuses = ['delivered', 'received'];
    if (!allowedStatuses.includes(order.status)) {
      return res.status(400).json({ message: 'cannot rate before delivery' });
    }

    // ensure product exists inside the order items
    const found = (order.items || []).some(it => String(it.product) === String(productId));
    if (!found) return res.status(400).json({ message: 'product not found in order' });

    // prevent duplicate rating for same order+product by same user
    const existing = await Testimonial.findOne({ userId, productId, orderId });
    if (existing) return res.status(400).json({ message: 'already rated' });

    const r = Math.max(1, Math.min(5, parseInt(rating, 10) || 0));
    const t = await Testimonial.create({
      userId,
      productId,
      orderId,
      rating: r,
      content: (content || '').trim()
    });

    return res.status(201).json({ message: 'created', data: t });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'server error', error: e.message });
  }
};

exports.publicList = async (req, res) => {
  try {
    const filter = { isApproved: true };
    if (req.query.productId && mongoose.isValidObjectId(req.query.productId)) {
      filter.productId = req.query.productId;
    }
    const list = await Testimonial.find(filter).sort({ createdAt: -1 }).limit(100).populate('userId', 'name email');
    return res.status(200).json({ message: 'testimonials', data: list });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'server error', error: e.message });
  }
};

exports.pending = async (req, res) => {
  try {
    const list = await Testimonial.find({ isApproved: false }).sort({ createdAt: -1 }).populate('userId', 'name email');
    return res.status(200).json({ message: 'pending', data: list });
  } catch (e) {
    return res.status(500).json({ message: 'server error', error: e.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, { isApproved: true, isSeenAt: new Date() }, { new: true });
    return res.status(200).json({ message: 'approved', data: t });
  } catch (e) {
    return res.status(500).json({ message: 'server error', error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'deleted' });
  } catch (e) {
    return res.status(500).json({ message: 'server error', error: e.message });
  }
};
