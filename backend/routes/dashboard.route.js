const express = require('express');
const router = express.Router();
const c = require('../controllers/dashboard.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');

router.get('/overview',authenticate,authorize('admin'),c.overview);

module.exports = router;

