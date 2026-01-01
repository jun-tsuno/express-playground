import express, { type Express } from "express";
import routes from "@/routes/index.js";
import { errorHandler } from "@/middlewares/error.middleware.js";
import cors from "cors";

const app: Express = express();

// ミドルウェア設定
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// ルートを登録
app.use("/", routes);

// エラーハンドリングミドルウェア（NOTE:ルート登録の後、最後に定義すること）
app.use(errorHandler);

export default app;
