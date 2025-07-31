import bcrypt from "bcryptjs";
import { User } from "../db/models/user.model.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role = "customer" } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email address already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    const user = newUser.toObject();
    delete user.password;

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      data: { user },
    });
  } catch (err) {
    console.error("❌ createUser error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const safeUser = user.toObject();
    delete safeUser.password;
    safeUser.token = token;

    return res.status(200).json({
      message: "Login successful",
      success: true,
      data: { user: safeUser },
    });
  } catch (err) {
    console.error("❌ loginUser error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
