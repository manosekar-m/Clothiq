const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getStats = async (req, res) => {
  try {
    const [users, orders, products] = await Promise.all([
      User.find({ role: 'user' }),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }),
      Product.find()
    ]);

    // Total revenue from paid orders
    const totalRevenue = orders.reduce((acc, o) =>
      o.paymentStatus === 'paid' ? acc + o.totalAmount : acc, 0);

    // Revenue last 7 days for chart
    const now = new Date();
    const chartMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      chartMap[key] = 0;
    }
    orders.forEach(o => {
      const key = new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      if (chartMap[key] !== undefined) {
        chartMap[key] += o.paymentStatus === 'paid' ? o.totalAmount : 0;
      }
    });
    const chartData = Object.entries(chartMap).map(([name, sales]) => ({ name, sales }));

    // Revenue this week vs last week
    const oneWeekAgo = new Date(now); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const thisWeekRev = orders.filter(o => new Date(o.createdAt) >= oneWeekAgo && o.paymentStatus === 'paid').reduce((a, o) => a + o.totalAmount, 0);
    const lastWeekRev = orders.filter(o => new Date(o.createdAt) >= twoWeeksAgo && new Date(o.createdAt) < oneWeekAgo && o.paymentStatus === 'paid').reduce((a, o) => a + o.totalAmount, 0);
    const revenueChange = lastWeekRev === 0 ? 100 : (((thisWeekRev - lastWeekRev) / lastWeekRev) * 100).toFixed(1);

    // Order status breakdown
    const statusBreakdown = orders.reduce((acc, o) => {
      acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
      return acc;
    }, {});

    // Recent 5 orders
    const recentOrders = orders.slice(0, 5).map(o => ({
      _id: o._id,
      userName: o.user?.name || 'Unknown',
      totalAmount: o.totalAmount,
      orderStatus: o.orderStatus,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt
    }));

    res.json({
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      totalUsers: users.length,
      pendingOrders: orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'processing').length,
      chartData,
      revenueChange,
      statusBreakdown,
      recentOrders
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin user' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
