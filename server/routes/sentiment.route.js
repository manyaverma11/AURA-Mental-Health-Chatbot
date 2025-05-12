import { Router } from "express";
import getSentiment from "../controllers/sentiment.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = new Router();

router.route("/sentiment").post(verifyJWT,getSentiment);

export default router;
