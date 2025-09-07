const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

async function place(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).lean();
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'empty cart' });
    }

    const items = [];
    let itemsTotal = 0;

    for (const it of cart.items) {
      const p = await Product.findById(it.product);
      if (!p) return res.status(400).json({ message: 'product missing' });

      if (it.variantId) {
        const v = (p.variants || []).id(it.variantId);
        if (!v) return res.status(400).json({ message: 'variant not found' });
        if ((v.stock || 0) < it.qty) return res.status(400).json({ message: 'variant stock insufficient' });
        v.stock = Math.max(0, (v.stock || 0) - it.qty);
      } else {
        if ((p.stock || 0) < it.qty) return res.status(400).json({ message: 'stock insufficient' });
        p.stock = Math.max(0, (p.stock || 0) - it.qty);
      }
      await p.save();

      items.push({
        product: p._id,
        variantId: it.variantId || null,
        variantKey: it.variantKey || null,
        title: p.title,
        price: p.price,
        qty: it.qty
      });
      itemsTotal += (p.price || 0) * (it.qty || 1);
    }

    const shipping = 0;
    const grandTotal = itemsTotal + shipping;

    const ship = req.body?.shippingAddress || {};
    const order = await Order.create({
      user: req.user._id,
      items,
      totals: { itemsTotal, shipping, grandTotal, currency: 'EGP' },
      paymentMethod: 'cod',
      shippingAddress: {
        line1: ship.address || ship.line1 || '',
        city: ship.city || '',
        governorate: ship.governorate || '',
        postalCode: ship.postalCode || '',
        phone: ship.phone || ''
      },
      status: 'pending',
      statusHistory: [{ status: 'pending', note: 'Order placed', changedBy: req.user._id }]
    });

    await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } });

    return res.status(201).json({ message: 'order placed', data: order });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'server error' });
  }
}

async function mine(req, res) {
  try {
    const list = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ message: 'orders', data: list });
  } catch (e) {
    return res.status(500).json({ message: 'server error' });
  }
}


async function getOne(req, res) {
  try {
    const o = await Order.findById(req.params.id).lean();
    if (!o) return res.status(404).json({ message: 'not found' });
    const isOwner = String(o.user) === String(req.user._id);
    if (!isOwner && (req.user.role !== 'admin')) return res.status(403).json({ message: 'forbidden' });
    return res.status(200).json({ message: 'order', data: o });
  } catch (e) {
    return res.status(500).json({ message: 'server error' });
  }
}


async function list(req, res) {
  try {
    const list = await Order.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ message: 'orders', data: list });
  } catch (e) {
    return res.status(500).json({ message: 'server error' });
  }
}

async function updateStatus(req, res) {
  try {
    const { status, note } = req.body;
    
    const allowed = [
      'pending','placed',
      'processing','preparing','ready-for-shipping',
      'shipped',
      'delivered','received',
      'cancelled','rejected',
      'paid'
    ];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'invalid status' });

    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: 'not found' });

    o.status = status;
    o.statusHistory.push({ status, note: note || '', changedBy: req.user._id, changedAt: new Date() });

    if (status === 'cancelled') {
      o.cancellation = {
        isCancelled: true,
        reason: note || 'Order cancelled by admin',
        at: new Date()
      };
    }

    await o.save();

    return res.status(200).json({ message: 'updated', data: o });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'server error' });
  }
}

module.exports = { place, mine, getOne, list, updateStatus };
