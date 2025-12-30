import { Router, type Router as RouterType } from "express";
import { getHealth } from "../controllers/health.controller.js";

const router: RouterType = Router();

// GET /health または GET /healthz
router.get("/", getHealth);

export default router;

