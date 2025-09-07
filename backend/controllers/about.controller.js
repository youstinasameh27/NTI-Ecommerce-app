const About = require('../models/about.model');

const SEED = `Youstina Brand is an Egyptian fashion store for Men & Women — clothing and shoes — built for the local market.
• Nationwide shipping across Egypt
• Cash on Delivery (COD) only
• 14-day replace or refund policy
• Friendly UI and simple ordering
• No offers — fair prices every day

Our mission is to bring modern styles that fit daily life in Egypt. Sizes and fits are shown clearly on each product page. For help with orders, replacement, or sizing, please contact us from the Contact page.`;

async function getAbout(req, res) {
  try {
    let doc = await About.findOne();
    if (!doc) {
      doc = await About.create({ content: SEED });
    }
    return res.status(200).json({ message: 'about', data: doc });
  } catch (e) {
    return res.status(500).json({ message: 'server error' });
  }
}

async function setAbout(req, res) {
  try {
    const body = req.body || {};
    let doc = await About.findOne();
    if (!doc) {
      doc = await About.create({ content: body.content || '', title: body.title || 'Youstina Brand — About Us', updatedBy: req.user?._id || null });
    } else {
      if (typeof body.title === 'string') doc.title = body.title;
      if (typeof body.content === 'string') doc.content = body.content;
      doc.updatedBy = req.user?._id || null;
      await doc.save();
    }
    return res.status(200).json({ message: 'saved', data: doc });
  } catch (e) {
    return res.status(500).json({ message: 'server error' });
  }
}

module.exports = { getAbout, setAbout };
