import { Router } from "express";
import protect from "../middleware/authMiddleware";
import {
  getUsers,
  signUp,
  logIn,
  deleteUser,
} from "../controllers/userController";

const router = Router();

router.get("/", protect, getUsers);
router.post("/signup", signUp);
router.post("/login", logIn);
router.delete("/:userId", protect, deleteUser);

export default router;
