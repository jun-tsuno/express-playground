import type { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/errors.js";
import type { ApiResponse } from "@/types/response.js";

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

	// 想定外エラー（500 Internal Server Error）
	console.error("Unexpected error:", error);

	const response: ApiResponse<never> = {
		success: false,
		error: {
			code: "INTERNAL_SERVER_ERROR",
			message:
				process.env.NODE_ENV === "production"
					? "An unexpected error occurred"
					: error.message,
		},
	};
	res.status(500).json(response);
};
