import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: Number, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // staff id who created
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
