import Sale from "../models/Sale.js";

// --- CREATE: Sale Add Karna ---
export const createSale = async (req, res) => {
  try {
    const { product, discountPercentage } = req.body;
    // Check agar is product par pehle se sale toh nahi lagi?
    const existingSale = await Sale.findOne({ product });
    if (existingSale) return res.status(400).json({ message: "Is product par pehle hi sale lagi hui hai!" });

    const newSale = new Sale({ product, discountPercentage });
    await newSale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- READ: Sab Sales Dekhna (Frontend Home Page ke liye) ---
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("product");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- UPDATE: Discount Badalna ---
export const updateSale = async (req, res) => {
  try {
    const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- DELETE: Sale Khatam Karna ---
export const deleteSale = async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: "Sale khatam kar di gayi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};