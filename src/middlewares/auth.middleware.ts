import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError, AUTH_ERROR_MESSAGE } from "@/utils/errors.js";
import { verifyAccessToken } from "@/utils/auth.js";

// 認証ミドルウェア（JWT 検証）
export const checkTokenMiddleware = (
	req: Request,
	_res: Response,
	next: NextFunction
): void => {
	// ヘッダーからトークンを取得する場合
	// const authHeader = req.header("Authorization");
	// if (!authHeader || !authHeader.startsWith("Bearer ")) {
	// 	throw new UnauthorizedError("権限がありません");
	// }
	// const token = authHeader.slice(7);

	const token = req.cookies?.token;

	if (!token) {
		throw new UnauthorizedError(AUTH_ERROR_MESSAGE.UNAUTHORIZED);
	}

	try {
		const decoded = verifyAccessToken(token);
		req.user = decoded.userId;

		next();
	} catch {
		throw new UnauthorizedError(AUTH_ERROR_MESSAGE.UNAUTHORIZED);
	}
};
