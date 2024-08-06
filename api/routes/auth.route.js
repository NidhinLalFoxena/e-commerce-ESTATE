import express from "express";
import {
  signIn,
  signInWithGoogle,
  signOut,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signIn);
router.post("/google", signInWithGoogle);
router.get("/signout", signOut);

export default router;
