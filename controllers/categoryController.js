import Category from "../models/Category.js";

// 1. GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch categories", error: error.message });
  }
};

// 2. CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    // req.file multer se aata hai, hum uska path save kar rahe hain
    const imagePath = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : "";

    if (!name || !imagePath) {
      return res.status(400).json({ message: "Name and Image are required!" });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name, image: imagePath }); 
    const savedCategory = await newCategory.save();
    
    res.status(201).json({ message: "Created", data: savedCategory });
  } catch (error) {
    res.status(400).json({ message: "Failed to create", error: error.message });
  }
};

// 3. UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let updateData = { name };

    // Agar nayi image upload hui hai toh path update karein
    if (req.file) {
      updateData.image = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Updated", data: updatedCategory });
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

// 4. DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};