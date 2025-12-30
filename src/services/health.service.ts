// ヘルスチェックサービス（ビジネスロジック）

export const checkHealth = async (): Promise<{
	status: string;
	timestamp: string;
	uptime: number;
}> => {
	// 将来的にDB接続確認などを追加可能
	// const dbStatus = await checkDatabaseConnection();

	return {
		status: "ok",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	};
};

