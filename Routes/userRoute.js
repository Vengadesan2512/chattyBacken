import express from "express";
import { secureRoute } from "../middleware/authMiddleware.js";
import {
  acceptfriendRequest,
  getFriendRequest,
  getfriendSuggestion,
  getmyFriends,
  outgoingFriendRequest,
  sendFriendRequest,
} from "../Controllers/userController.js";

const router = express.Router();
router.use(secureRoute);

router.get("/friends-suggestion", getfriendSuggestion);
router.get("/my-frineds", getmyFriends);
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptfriendRequest);
router.get("/friend-request", getFriendRequest);
router.get("/outgoingfriend-request", outgoingFriendRequest);

export default router;
