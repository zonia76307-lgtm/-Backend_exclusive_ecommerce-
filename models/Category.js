import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Category ka naam zaroori hai"], 
      unique: true,
      trim: true 
    },
    // iconName ki jagah ab image hai jo file path save karega
    image: { 
      type: String, 
      required: [true, "Category image zaroori hai"] 
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;