import { Router } from "express";
import protect from "../middleware/authMiddleware";
import {
  getProduct,
  getProducts,
  postProduct,
  deleteProduct,
  patchProduct,
  searchProducts,
} from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.get("/:text", searchProducts);
router.get("/:productId", getProduct);
router.post("/", protect, postProduct);
router.patch("/:productId", protect, patchProduct);
router.delete("/:productId", protect, deleteProduct);

export default router;
