import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getAdminStats = async (req, res) => {
  try {
    // 1. Total Revenue (Sab delivered orders ka sum)
    const orders = await Order.find({ status: 'Delivered' });
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

    // 2. Counts for the Cards
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const totalProducts = await Order.countDocuments(); // New Orders logic

    // 3. Recent Activity (Latest 5 orders)
    const recentActivity = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    res.json({
      totalRevenue,
      shippedOrders,
      pendingOrders,
      totalOrders: totalProducts,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};