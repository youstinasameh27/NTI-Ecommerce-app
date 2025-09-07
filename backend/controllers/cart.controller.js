const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'title imgURL price route')
      .lean();

    if (!cart) {
      cart = (await Cart.create({ user: req.user._id, items: [] })).toObject();
    }

    return res.status(200).json({ message: 'ok', data: cart });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'error' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1, variantId } = req.body;

    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ message: 'product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    let variantKey = null;
    if (variantId) {
      const v = (product.variants || []).find(v => String(v._id) === String(variantId));
      if (!v) return res.status(400).json({ message: 'invalid variant' });
      if (v.stock < qty) return res.status(400).json({ message: 'insufficient stock' });
      variantKey = v.key;
    } else {
      if ((product.stock || 0) < qty) return res.status(400).json({ message: 'insufficient stock' });
    }

    const existing = cart.items.find(i => String(i.product) === String(productId) && String(i.variantId || '') === String(variantId || ''));

    if (existing) {
      existing.qty = qty;
      existing.price = product.price;
      if (!existing.title) existing.title = product.title;
      if (variantKey) existing.variantKey = variantKey;
    } else {
      cart.items.push({
        product: productId,
        title: product.title,
        price: product.price,
        priceAtAdd: product.price,
        qty,
        variantId: variantId || null,
        variantKey
      });
    }

    await cart.save();
    return res.status(200).json({ message: 'added', data: cart });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'error' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'cart not found' });
    cart.items = cart.items.filter(i => String(i._id) !== String(itemId));
    await cart.save();
    return res.status(200).json({ message: 'removed', data: cart });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'error' });
  }
};

const validateCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).lean();
    if (!cart) return res.status(200).json({ message: 'ok', data: { ok: true, notes: [] } });

    const notes = [];
    for (const it of cart.items) {
      const p = await Product.findById(it.product).lean();
      if (!p) { notes.push('product removed'); continue; }
      const latestPrice = it.variantId ? (p.variants.find(v => String(v._id) === String(it.variantId))?.price || p.price) : p.price;
      if (latestPrice !== it.price) notes.push(`price changed for ${p.title}`);
      if (it.variantId) {
        const v = p.variants.find(v => String(v._id) === String(it.variantId));
        if (!v || (v.stock || 0) < it.qty) notes.push(`stock issue for ${p.title}`);
      } else {
        if ((p.stock || 0) < it.qty) notes.push(`stock insufficient for ${p.title}`);
      }
    }
    const ok = notes.length === 0;
    return res.status(200).json({ message: 'ok', data: { ok, notes } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'error' });
  }
};

const guestGetCart = async (req, res) => {
  try {
    const sessionId = req.query.sessionId || req.body.sessionId || req.params.sessionId;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    let cart = await Cart.findOne({ sessionId }).populate('items.product', 'title imgURL price route').lean();
    if (!cart) cart = { user: null, items: [] };
    return res.status(200).json({ message: 'ok', data: cart });
  } catch (e) {
    return res.status(500).json({ message: 'error' });
  }
};

const guestAddToCart = async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    const { productId, qty = 1, variantId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ message: 'product not found' });

    let cart = await Cart.findOne({ sessionId });
    if (!cart) cart = await Cart.create({ sessionId, items: [] });

    let variantKey = null;
    if (variantId) {
      const v = (product.variants || []).find(v => String(v._id) === String(variantId));
      if (!v) return res.status(400).json({ message: 'invalid variant' });
      if (v.stock < qty) return res.status(400).json({ message: 'insufficient stock' });
      variantKey = v.key;
    } else {
      if ((product.stock || 0) < qty) return res.status(400).json({ message: 'insufficient stock' });
    }

    const existing = cart.items.find(i => String(i.product) === String(productId) && String(i.variantId || '') === String(variantId || ''));

    if (existing) {
      existing.qty = qty;
      existing.price = product.price;
      if (!existing.title) existing.title = product.title;
      if (variantKey) existing.variantKey = variantKey;
    } else {
      cart.items.push({
        product: productId,
        title: product.title,
        price: product.price,
        priceAtAdd: product.price,
        qty,
        variantId: variantId || null,
        variantKey
      });
    }

    await cart.save();
    return res.status(200).json({ message: 'added', data: cart });
  } catch (e) {
    return res.status(500).json({ message: 'error' });
  }
};

const guestValidateCart = async (req, res) => {
  try {
    const sessionId = req.body.sessionId || req.query.sessionId || req.params.sessionId;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    const cart = await Cart.findOne({ sessionId }).lean();
    if (!cart) return res.status(200).json({ message: 'ok', data: { ok: true, notes: [] } });

    const notes = [];
    for (const it of cart.items) {
      const p = await Product.findById(it.product).lean();
      if (!p) { notes.push('product removed'); continue; }
      const latestPrice = it.variantId ? (p.variants.find(v => String(v._id) === String(it.variantId))?.price || p.price) : p.price;
      if (latestPrice !== it.price) notes.push(`price changed for ${p.title}`);
      if (it.variantId) {
        const v = p.variants.find(v => String(v._id) === String(it.variantId));
        if (!v || (v.stock || 0) < it.qty) notes.push(`stock issue for ${p.title}`);
      } else {
        if ((p.stock || 0) < it.qty) notes.push(`stock insufficient for ${p.title}`);
      }
    }
    const ok = notes.length === 0;
    return res.status(200).json({ message: 'ok', data: { ok, notes } });
  } catch (e) {
    return res.status(500).json({ message: 'error' });
  }
};

module.exports = { getCart, addToCart, removeFromCart, validateCart, guestGetCart, guestAddToCart, guestValidateCart };
