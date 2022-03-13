import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
});

export interface ProductInterface {
  _id: string;
  name: string;
  description: string;
  price: number;
  productImage: string;
}

export default mongoose.model<ProductInterface>("Product", productSchema);
