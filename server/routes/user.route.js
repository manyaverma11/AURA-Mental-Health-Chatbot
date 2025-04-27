import { Router } from "express";
import {
    registerUser, loginUser, logoutUser, refreshAccessToken
} from "../controllers/user.controller.js"

const router = new Router();

router.route("/register").post(registerUser);

export default router;