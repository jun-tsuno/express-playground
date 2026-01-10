import { Router, type Router as RouterType } from "express";
import { asyncHandler } from "@/utils/async-handler.js";
import {
	postRegister,
	postLogin,
	postRefresh,
	postLogout,
} from "@/controllers/auth.controller.js";
import {
	registerValidator,
	loginValidator,
	refreshValidator,
} from "@/validators/auth.validator.js";
import { validate } from "@/middlewares/validate.middleware.js";

const router: RouterType = Router();

router.post(
	"/register",
	registerValidator,
	validate,
	asyncHandler(postRegister)
);

router.post("/login", loginValidator, validate, asyncHandler(postLogin));

router.post("/refresh", refreshValidator, validate, asyncHandler(postRefresh));

router.post("/logout", asyncHandler(postLogout));

export default router;
