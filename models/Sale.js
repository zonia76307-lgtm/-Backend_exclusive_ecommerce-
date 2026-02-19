import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  discountPercentage: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// YE WALI LINE CHECK KAREIN: "export default" hona chahiye
const Sale = mongoose.model("Sale", saleSchema);
export default Sale;