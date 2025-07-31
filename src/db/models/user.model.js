import mongoose from "mongoose";
import { createId } from "@paralleldrive/cuid2";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => createId(),
  },

  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
  },
});

export const User = mongoose.model("User", userSchema);
