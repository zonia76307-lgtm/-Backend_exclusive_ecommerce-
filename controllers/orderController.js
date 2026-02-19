import Order from "../models/Order.js";

// @desc    1. Create New Order
export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice, phoneNumber } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      phoneNumber // phoneNumber bhi add kar diya hai
    });

    const createdOrder = await order.save();
    res.status(201).json({ message: "Order placed successfully", data: createdOrder });
  } catch (error) {
    res.status(500).json({ message: "Order failed", error: error.message });
  }
};

// @desc    2. Get Logged-in User Orders (For My Orders Page)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// @desc    3. User Dashboard Analysis (🔥 Naya Function)
export const getUserStats = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    
    // Stats calculation
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    // Maan lijiye 'isDelivered' ya status check karna hai
    const pendingOrders = orders.filter(order => order.status !== 'Delivered').length;

    res.status(200).json({
      totalOrders,
      totalSpent,
      pendingOrders,
      orders // Saaray orders ki detail bhi bhej di
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

// @desc    4. Get All Orders (For Admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders", error: error.message });
  }
};

// @desc    5. Update Order Status (For Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      // Agar status delivered ho raha hai toh date bhi set kar sakte hain
      if(req.body.status === 'Delivered') {
          order.isDelivered = true;
          order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json({ message: "Status updated", data: updatedOrder });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};