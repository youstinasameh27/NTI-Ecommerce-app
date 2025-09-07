const express = require('express');
const router = express.Router();
const c = require('../controllers/testimonial.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');

router.get('/public',c.publicList);
router.get('/pending',authenticate,authorize('admin'),c.pending);
router.post('/',authenticate,c.add);
router.post('/:id/approve',authenticate,authorize('admin'),c.approve);
router.delete('/:id',authenticate,authorize('admin'),c.remove);

module.exports = router;
