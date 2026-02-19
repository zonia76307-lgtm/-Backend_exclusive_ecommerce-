import Wishlist from "../models/Wishlist.js";

// @desc    1. LIKE/UNLIKE (Toggle Logic)
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
    } else {
      const isExist = wishlist.products.includes(productId);
      if (isExist) {
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
      } else {
        wishlist.products.push(productId);
      }
      await wishlist.save();
    }
    
    const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    res.json({ message: "Wishlist updated", data: updatedWishlist });
  } catch (error) {
    res.status(500).json({ message: "Failed to update", error: error.message });
  }
};

// @desc    2. GET WISHLIST LIST
export const getMyWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) return res.json({ products: [] });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch", error: error.message });
  }
};

// @desc    3. REMOVE SINGLE ITEM
export const removeSingleFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
      await wishlist.save();
      res.json({ message: "Item removed from wishlist", productId });
    } else {
      res.status(404).json({ message: "Wishlist not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    4. CLEAR ALL (Fixed 🔥)
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = []; // Array khali kiya
      await wishlist.save();  // 🔥 Database mein save lazmi hai
      res.status(200).json({ message: "Wishlist cleared", products: [] });
    } else {
      res.json({ products: [] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};