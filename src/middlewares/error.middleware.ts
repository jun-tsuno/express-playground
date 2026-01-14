import type { Request, Response, NextFunction } from "express";
import { AppError, InternalServerError } from "@/utils/errors.js";
import type { ApiResponse } from "@/types/response.js";
import { logger } from "@/utils/logger.js";

/**
 * グローバルエラーハンドリングミドルウェア
 * すべてのエラーを統一形式で処理する
 */
export const errorHandler = (
	error: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
): void => {
	// AppError（想定内エラー）
	if (error instanceof AppError) {
		const response: ApiResponse<never> = {
			success: false,
			error: {
				code: error.code,
				message: error.message,
				...(error.details && { details: error.details }),
			},
		};
		res.status(error.statusCode).json(response);
		return;
	}

	// 想定外エラーはログ出力（対応が必要）
	logger.error(error, "想定外エラー");

	// 想定外エラー → InternalServerErrorに変換
	const internalError = new InternalServerError(error.message);

	const response: ApiResponse<never> = {
		success: false,
		error: {
			code: internalError.code,
			message: internalError.message,
		},
	};
	res.status(internalError.statusCode).json(response);
};
