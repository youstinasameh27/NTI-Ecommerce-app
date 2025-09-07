const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { getCart, addToCart, removeFromCart, validateCart, guestGetCart, guestAddToCart, guestValidateCart } = require('../controllers/cart.controller');

const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/:itemId', protect, removeFromCart);
router.get('/validate', protect, validateCart);

router.post('/guest/add', guestAddToCart);
router.post('/guest/validate', guestValidateCart);
router.get('/guest/:sessionId', guestGetCart);

module.exports = router;
