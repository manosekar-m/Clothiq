const express = require('express');
const router = express.Router();
const multer = require('multer');
const { placeOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus, updatePaymentStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `payment-${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post('/', protect, upload.single('paymentScreenshot'), placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/payment', protect, adminOnly, updatePaymentStatus);

module.exports = router;
