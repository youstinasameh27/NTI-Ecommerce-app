const express = require('express');
const router = express.Router();
const c = require('../controllers/contact.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');

router.post('/',c.submit);
router.get('/',authenticate,authorize('admin'),c.list);
router.post('/:id/handled',authenticate,authorize('admin'),c.markHandled);

module.exports = router;
