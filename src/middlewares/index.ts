import express, { type Express } from "express";

// ミドルウェア設定を統合
export const setupMiddlewares = (app: Express): void => {
	// JSON パーサー
	app.use(express.json());

	// 将来的に追加されるミドルウェア
	// app.use(cors());
	// app.use(helmet());
	// app.use(requestIdMiddleware);
	// app.use(errorMiddleware);
};
