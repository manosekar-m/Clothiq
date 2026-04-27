const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getProducts, getAllProductsAdmin, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { files: 5 } });

router.get('/', getProducts);
router.get('/admin/all', protect, adminOnly, getAllProductsAdmin);
router.get('/:id', getProductById);

// Separate upload route for convenience
router.post('/upload', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: req.file.filename });
});

router.post('/', protect, adminOnly, upload.array('images', 5), addProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
