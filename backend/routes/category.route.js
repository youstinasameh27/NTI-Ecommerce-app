
const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/category.controller');


router.post('/ensure-roots', ctrl.ensureRoots);
router.get('/', ctrl.list);
router.post('/', ctrl.create);

module.exports = router;
