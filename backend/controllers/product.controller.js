const Product = require('../models/Product');
const Category = require('../models/Category');

exports.createProduct = async (req, res) => {
  try {
    const body = req.body;
    const p = new Product(body);
    await p.save();
    res.json({ success: true, data: p });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const p = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!p) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: p });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to update product' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const p = await Product.findById(id).populate('category');
    if (!p) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: p });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to get product' });
  }
};

exports.getProductByRoute = async (req, res) => {
  try {
    const route = req.params.route;
    const p = await Product.findOne({ route }).populate('category');
    if (!p) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: p });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to get product' });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const q = req.query || {};
    const filter = {};
    if (q.category) filter.category = q.category;
    if (q.search) filter.title = { $regex: q.search, $options: 'i' };
    filter.isDeleted = false;
    if (typeof q.isActive !== 'undefined') filter.isActive = q.isActive === 'true';
    let query = Product.find(filter).populate('category').limit(200);
    if (q.sort) {
      let s = q.sort;
      if (s === 'name') s = 'title';
      if (s === '-name') s = '-title';
      query = query.sort(s);
    }
    const products = await query.exec();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to list products' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to delete product' });
  }
};

exports.addVariant = async (req, res) => {
  try {
    const productId = req.params.id;
    const body = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const map = {};
    for (const v of body.values || []) map[v.name] = v.value;
    const key = product.options.map(o => `${o.name}:${map[o.name]}`).join('|');
    const variant = {
      key,
      values: body.values || [],
      price: body.price,
      stock: body.stock || 0,
      sku: body.sku
    };
    product.variants.push(variant);
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to add variant' });
  }
};
