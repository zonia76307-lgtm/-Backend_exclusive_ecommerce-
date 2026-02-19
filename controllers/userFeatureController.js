import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";
import Order from "../models/Order.js";

// 1. Single Product Detail
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product nahi mila" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Wishlist CRUD (Toggle logic - Best for Frontend)
export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
        } else {
            const index = wishlist.products.indexOf(productId);
            if (index === -1) {
                wishlist.products.push(productId); // Add
            } else {
                wishlist.products.splice(index, 1); // Remove
            }
            await wishlist.save();
        }
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Add Order
export const placeOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;
        const newOrder = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            totalPrice
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};