import { type Request, type Response } from "express";
import { checkHealth } from "../services/health.service.js";

// ヘルスチェックコントローラー（HTTP リクエスト/レスポンス処理）
export const getHealth = async (
	_req: Request,
	res: Response
): Promise<void> => {
	try {
		const health = await checkHealth();
		res.status(200).json({
			success: true,
			data: health,
		});
	} catch {
		res.status(500).json({
			success: false,
			error: {
				code: "HEALTH_CHECK_FAILED",
				message: "ヘルスチェックに失敗しました",
			},
		});
	}
};
