// ルーティング統合
import { Router, type Router as RouterType } from "express";
import taskRoutes from "@/routes/task.routes";
import authRoutes from "@/routes/auth.routes";

const router: RouterType = Router();

// タスク
router.use("/tasks", taskRoutes);
// 認証
router.use("/auth", authRoutes);

export default router;
