import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 }, 
    onSale: { type: Boolean, default: false },       
    image: { type: String, required: true },
    category: { 
      type: String, 
      required: true 
    }, 
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    // 🔥 NEW FIELD: Ye sales track karne ke liye hai
    sold: { type: Number, default: 0 } 
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);