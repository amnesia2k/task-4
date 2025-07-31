import { Product } from "../db/models/product.model.js";

export const getProducts = async (_, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      data: { products },
    });
  } catch (err) {
    console.error("❌ getProducts error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createProduct = async (req, res) => {
  const {
    productName,
    cost,
    productImages,
    description,
    stockStatus = "in_stock",
  } = req.body;
  const ownerId = req.user.userId;

  try {
    const defaultImage =
      "https://via.placeholder.com/300x300.png?text=No+Image";

    const images =
      Array.isArray(productImages) && productImages.length > 0
        ? productImages
        : [defaultImage];

    const product = await Product.create({
      productName,
      cost,
      productImages: images,
      description,
      stockStatus,
      ownerId,
    });

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      data: { product },
    });
  } catch (err) {
    console.error("❌ createProduct error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found", success: false });

    return res.status(200).json({ message: "Product deleted", success: true });
  } catch (err) {
    console.error("❌ deleteProduct error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
