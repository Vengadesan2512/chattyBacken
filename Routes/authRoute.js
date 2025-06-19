import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
} from "../Controllers/authController.js";
import { secureRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", secureRoute, onboard);

router.get("/individual-Profile", secureRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
