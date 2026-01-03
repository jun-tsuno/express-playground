import express, { type Express } from "express";
import routes from "@/routes/index.js";
import { errorHandler } from "@/middlewares/error.middleware.js";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app: Express = express();

// ミドルウェア設定
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
		allowedHeaders: ["Content-Type"],
	})
);

// ルートを登録
app.use("/", routes);

// エラーハンドリングミドルウェア（NOTE:ルート登録の後、最後に定義すること）
app.use(errorHandler);

export default app;
