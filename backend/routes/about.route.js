const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const { getAbout, setAbout } = require('../controllers/about.controller');

const router = express.Router();

router.get('/', getAbout);
router.post('/', protect, isAdmin, setAbout);

module.exports = router;
