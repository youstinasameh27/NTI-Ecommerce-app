const Faq = require('../models/faq.model');

const SEED = [
  {
    question: 'What payment methods do you accept?',
    answer: 'Cash on Delivery (COD) across Egypt.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Nationwide shipping typically takes 2–5 business days depending on your city/governorate.',
  },
  {
    question: 'What is your return policy?',
    answer: 'You have 14 days to replace or refund if the item is unused and in original condition.',
  },
  {
    question: 'How do I choose sizes?',
    answer: 'Each product page shows available sizes (e.g., S/M/L for shirts or 36–40 for shoes). Please select your size before adding to cart.',
  },
  {
    question: 'Do you sell men and women clothes?',
    answer: 'Yes. We stock Men & Women apparel and shoes. Use filters or the categories menu to find what you need.',
  }
];

async function list(req, res) {
  try {
    const count = await Faq.countDocuments();
    if (count === 0) {
      await Faq.insertMany(SEED.map(x => ({ ...x, enabled: true })));
    }
    const rows = await Faq.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ message: 'faq', data: rows });
  } catch (e) {
    return res.status(500).json({ message: 'server error' });
  }
}

async function create(req, res) {
  try {
    const { question, answer, enabled } = req.body || {};
    if (!question || !answer) return res.status(400).json({ message: 'missing fields' });
    const row = await Faq.create({ question, answer, enabled: enabled !== false });
    return res.status(201).json({ message: 'created', data: row });
  } catch (e) {
    return res.status(500).json({ message: 'server error' });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const row = await Faq.findById(id);
    if (!row) return res.status(404).json({ message: 'not found' });
    if (typeof body.question === 'string') row.question = body.question;
    if (typeof body.answer === 'string') row.answer = body.answer;
    if (typeof body.enabled === 'boolean') row.enabled = body.enabled;
    await row.save();
    return res.status(200).json({ message: 'updated', data: row });
  } catch (e) {
    return res.status(500).json({ message: 'server error' });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await Faq.deleteOne({ _id: id });
    return res.status(200).json({ message: 'deleted' });
  } catch (e) {
    return res.status(500).json({ message: 'server error' });
  }
}

module.exports = { list, create, update, remove };
