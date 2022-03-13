import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    required: true,
  },
  address: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

interface Order {
  _id: string;
  products: string[];
  address: string;
  user: string;
}

export default mongoose.model<Order>("Order", orderSchema);
