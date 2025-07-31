import { Router } from "express";
import {
  createProduct,
  getProducts,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", authenticate, authorizeAdmin, createProduct);
router.get("/", getProducts);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
