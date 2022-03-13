import { Router } from "express";
import protect from "../middleware/authMiddleware";
import {
  getUserOrders,
  getAllOrders,
  postOrder,
  deleteOrder,
} from "../controllers/orderController";

const router = Router();

router.get("/", protect, getAllOrders);
router.get("/:userId", protect, getUserOrders);
router.post("/", protect, postOrder);
router.delete("/:orderId", protect, deleteOrder);

export default router;
