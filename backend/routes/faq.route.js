const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const { list, create, update, remove } = require('../controllers/faq.controller');

const router = express.Router();

router.get('/', list);
router.post('/', protect, isAdmin, create);
router.post('/:id', protect, isAdmin, update);
router.post('/:id/delete', protect, isAdmin, remove);

module.exports = router;
