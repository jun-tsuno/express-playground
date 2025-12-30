import "reflect-metadata";
import "dotenv/config";
import app from "./app.js";
import { AppDataSource } from "./db/data-source.js";

const PORT = process.env.PORT || 8888;

// データベース接続を初期化してからサーバーを起動
const startServer = async (): Promise<void> => {
	try {
		// 既に初期化されている場合はスキップ
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
			console.log("データベースが初期化されました");
		} else {
			console.log("データベースは既に初期化されています");
		}

		app.listen(PORT, () => {
			console.log(`サーバーが ${PORT} で起動しました`);
		});
	} catch (err) {
		console.error("データベース初期化エラー:", err);
		process.exit(1);
	}
};

startServer();
