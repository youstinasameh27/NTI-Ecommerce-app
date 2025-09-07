const express = require('express');
const router = express.Router();
const c = require('../controllers/reports.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');

router.get('/sales',authenticate,authorize('admin'),c.sales);
router.get('/products',authenticate,authorize('admin'),c.products);

module.exports = router;
