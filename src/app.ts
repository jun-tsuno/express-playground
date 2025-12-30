import express, { type Express } from "express";
import routes from "./routes/index.js";
import { setupMiddlewares } from "./middlewares/index.js";

const app: Express = express();

// ミドルウェア設定
setupMiddlewares(app);

// ルートを登録
app.use("/", routes);

export default app;
