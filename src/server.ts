import "reflect-metadata";
import "dotenv/config";
import app from "@/app.js";
import { AppDataSource } from "@/db/data-source.js";
import { logger } from "@/utils/logger.js";

const PORT = process.env.PORT || 8888;

// データベース接続を初期化してからサーバーを起動
const startServer = async (): Promise<void> => {
	try {
		// 既に初期化されている場合はスキップ
		if (!AppDataSource.isInitialized) {
			await AppDataSource.initialize();
			logger.info("データベースが初期化されました");
		} else {
			logger.info("データベースは既に初期化されています");
		}

		app.listen(PORT, () => {
			logger.info(`サーバーが ${PORT} で起動しました`);
		});
	} catch (err) {
		logger.error(err, "データベース初期化エラー");
		process.exit(1);
	}
};

startServer();
