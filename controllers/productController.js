import Product from "../models/Product.js";

// --- 1. GET ALL PRODUCTS ---
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 2. GET SINGLE PRODUCT ---
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product nahi mila" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. CREATE PRODUCT (Admin) ---
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, countInStock, discountPercentage, onSale } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({
      name,
      description,
      price,
      image: imagePath, 
      category,
      countInStock,
      discountPercentage,
      onSale: onSale === 'true' || onSale === true 
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- 4. UPDATE PRODUCT (Admin) ---
export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: "Product nahi mila" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- 5. DELETE PRODUCT ---
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product nahi mila" });
    res.json({ message: "Product delete ho gaya" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 6. GET FLASH SALES ---
export const getFlashSales = async (req, res) => {
  try {
    const saleProducts = await Product.find({ onSale: true });
    res.json(saleProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 7. GET NEW ARRIVALS (Latest 4) ---
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(4);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 8. GET BEST SELLING (Only products with sales > 0) ---
export const getBestSelling = async (req, res) => {
  try {
    // Logic: Find products where sold is greater than 0, sort by highest sales, limit to 4
    const products = await Product.find({ sold: { $gt: 0 } }) 
      .sort({ sold: -1 }) 
      .limit(4);
      
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};