// ルーティング統合
import { Router, type Router as RouterType } from "express";
import healthRoutes from "./health.routes.js";
import taskRoutes from "./task.routes.js";

const router: RouterType = Router();

// ヘルスチェック
router.use("/health", healthRoutes);

// タスク
router.use("/tasks", taskRoutes);

export default router;
