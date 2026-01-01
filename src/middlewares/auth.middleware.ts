import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@/utils/errors";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

// 認証ミドルウェア（JWT 検証）
export const checkTokenMiddleware = (
	req: Request,
	_res: Response,
	next: NextFunction
): void => {
	const authHeader = req.header("Authorization");

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new UnauthorizedError("権限がありません");
	}

	const token = authHeader.slice(7);

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload;

		req.user = decoded.userId;

		next();
	} catch {
		throw new UnauthorizedError("権限がありません");
	}
};
