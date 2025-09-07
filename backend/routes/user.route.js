const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/user.controller');
const { login, me, logout, updateMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.get('/', authenticate, authorize('admin'), getUsers);
router.post('/', createUser('user'));
router.post('/login', login);
router.get('/me', authenticate, me);
router.post('/me', authenticate, updateMe);
router.post('/logout', authenticate, logout);
router.post('/admin', authenticate, authorize('admin'), createUser('admin'));

module.exports = router;
