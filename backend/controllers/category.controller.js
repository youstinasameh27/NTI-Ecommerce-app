
const Category = require('../models/category.model');

async function ensureRoots(req, res) {
  try {
    const roots = await Category.find({ parentId: null }).lean();

    const hasMen = roots.some(r => (r.route === 'men') || ((r.name || '').toLowerCase() === 'men'));
    const hasWomen = roots.some(r => (r.route === 'women') || ((r.name || '').toLowerCase() === 'women'));

    const ops = [];
    if (!hasMen) ops.push({ name: 'Men', route: 'men', parentId: null });
    if (!hasWomen) ops.push({ name: 'Women', route: 'women', parentId: null });
    if (ops.length) await Category.insertMany(ops);

    const updated = await Category.find({ parentId: null }).lean();
    return res.json({ ok: true, data: updated });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message || 'Failed' });
  }
}


async function list(req, res) {
  try {
    const { parentId } = req.query;
    const q = {};
    if (typeof parentId === 'string' && parentId) q.parentId = parentId;
    const rows = await Category.find(q).sort({ name: 1 }).lean();
    return res.json({ ok: true, data: rows });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message || 'Failed' });
  }
}


async function create(req, res) {
  try {
    let { name, route, parentId } = req.body;
    if (!name) return res.status(400).json({ ok: false, message: 'name is required' });

    let slug = String(route || name).trim().toLowerCase().replace(/\s+/g, '-');

    if (parentId) {
      const parent = await Category.findById(parentId).lean();
      if (!parent) return res.status(400).json({ ok: false, message: 'Invalid parentId' });
      const prefix = parent.route || (parent.name || '').toLowerCase();
      if (prefix && !slug.startsWith(prefix + '-')) slug = `${prefix}-${slug}`;
    }

    const doc = await Category.create({ name: String(name).trim(), route: slug, parentId: parentId || null });
    return res.json({ ok: true, data: doc });
  } catch (e) {
    if (e && e.code === 11000) return res.status(409).json({ ok: false, message: 'Category route already exists' });
    return res.status(500).json({ ok: false, message: e.message || 'Failed' });
  }
}

module.exports = {
  ensureRoots,
  list,
  create
};
