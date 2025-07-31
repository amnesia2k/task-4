import { createId } from "@paralleldrive/cuid2";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => createId(),
  },

  productName: {
    type: String,
    required: true,
  },

  ownerId: {
    type: String,
    ref: "User",
    required: true,
  },

  cost: {
    type: Number,
    required: true,
  },

  productImages: [String],

  description: String,

  stockStatus: {
    type: String,
    enum: ["in_stock", "out_of_stock"],
    default: "in_stock",
  },
});

export const Product = mongoose.model("Product", productSchema);
