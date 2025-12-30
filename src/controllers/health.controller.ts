import { type Request, type Response } from "express";
import { checkHealth } from "../services/health.service.js";
import type { ApiResponse } from "../types/response.js";

// ヘルスチェックコントローラー（HTTP リクエスト/レスポンス処理）
export const getHealth = async (
	_req: Request,
	res: Response
): Promise<void> => {
	try {
		const health = await checkHealth();
		const response: ApiResponse<typeof health> = {
			success: true,
			data: health,
		};
		res.status(200).json(response);
	} catch {
		const response: ApiResponse<never> = {
			success: false,
			error: {
				code: "HEALTH_CHECK_FAILED",
				message: "ヘルスチェックに失敗しました",
			},
		};
		res.status(500).json(response);
	}
};
