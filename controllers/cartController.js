import Cart from "../models/Cart.js";

// Helper Function: Cart fetch karke discounts apply karne ke liye
const getFullCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("cartItems.product");
  if (!cart) return [];
  
  return cart.cartItems
    .filter(item => item.product !== null) 
    .map(item => {
      const p = item.product;
      
      // Discount Logic
      let finalPrice = p.price;
      if (p.onSale && p.discountPercentage > 0) {
        finalPrice = p.price - (p.price * (p.discountPercentage / 100));
      }

      return {
        _id: p._id,
        name: p.name,
        price: finalPrice,
        originalPrice: p.price,
        discount: p.discountPercentage,
        onSale: p.onSale,
        image: p.image,
        qty: item.quantity
      };
    });
};

// 1. ADD TO CART (With Dynamic Message Logic)
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });
    let isNewItem = true; // 🔥 Pehle se assume karein ke item naya hai

    if (cart) {
      const itemIndex = cart.cartItems.findIndex(p => p.product.toString() === productId);
      
      if (itemIndex > -1) {
        // Agar item pehle se maujood hai
        cart.cartItems[itemIndex].quantity = Number(quantity) || 1;
        isNewItem = false; // 🔥 Ab ye item naya nahi raha
      } else {
        // Agar cart hai par product pehli baar add ho raha hai
        cart.cartItems.push({ product: productId, quantity: Number(quantity) || 1 });
      }
      await cart.save();
    } else {
      // Agar user ka pehla cart create ho raha hai
      cart = await Cart.create({
        user: userId,
        cartItems: [{ product: productId, quantity: Number(quantity) || 1 }]
      });
    }

    const items = await getFullCart(userId);
    
    // 🔥 Dynamic Message for Network Tab & Frontend
    const responseMessage = isNewItem ? "Product Added to Cart" : "Cart Updated";

    res.status(200).json({ 
      success: true, 
      message: responseMessage, 
      items 
    });

  } catch (error) {
    res.status(500).json({ message: "Add failed", error: error.message });
  }
};

// 2. GET CART
export const getCart = async (req, res) => {
  try {
    const items = await getFullCart(req.user._id);
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
};

// 3. UPDATE QUANTITY
export const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const itemIndex = cart.cartItems.findIndex(p => p.product.toString() === productId);
    
    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity = Number(quantity);
      await cart.save();
      const items = await getFullCart(req.user._id);
      res.status(200).json({ message: "Quantity Updated", items });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

// 4. REMOVE ITEM
export const removeItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== req.params.id);
    await cart.save();
    const items = await getFullCart(req.user._id);
    res.status(200).json({ message: "Item Removed", items });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

// 5. CLEAR CART
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) { 
      cart.cartItems = []; 
      await cart.save(); 
    }
    res.status(200).json({ message: "Cart Cleared", items: [] });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};