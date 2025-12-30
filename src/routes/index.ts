// ルーティング統合
import { Router, type Router as RouterType } from "express";
import taskRoutes from "@/routes/task.routes.js";

const router: RouterType = Router();

// タスク
router.use("/tasks", taskRoutes);

export default router;
