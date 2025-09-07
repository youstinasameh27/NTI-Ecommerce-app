const express = require('express');
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const { place, mine, getOne, list, updateStatus } = require('../controllers/order.controller');

const router = express.Router();

router.post('/', protect, place);
router.get('/mine', protect, mine);
router.get('/:id', protect, getOne);

router.get('/', protect, isAdmin, list);
router.post('/:id/status', protect, isAdmin, updateStatus);

module.exports = router;
