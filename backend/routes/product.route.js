const express = require('express');
const path = require('path');
const multer = require('multer');
const { protect, isAdmin } = require('../middlewares/auth.middleware');
const {list, getOne, create, recommendations,setOptions, setVariants} = require('../controllers/product.controller');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const base = path.basename(file.originalname || 'file', ext).replace(/\s+/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});
const upload = multer({ storage });

router.get('/', list);
router.get('/:route/recommendations', recommendations);
router.get('/:route', getOne);


router.post('/', protect, isAdmin, upload.single('img'), create);
router.post('/:id/options', protect, isAdmin, setOptions);
router.post('/:id/variants', protect, isAdmin, setVariants);

module.exports = router;
