import { Router } from "express";
import {  } from "../controllers/sentiment.controller.js";

const router = new Router();

router.route("/sentiment").post();

export default router;
