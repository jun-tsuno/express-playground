import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ValidationError } from "@/utils/errors.js";

// バリデーションミドルウェア
export const validate = (
	req: Request,
	_res: Response,
	next: NextFunction
): void => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new ValidationError("入力内容に誤りがあります", {
			fields: errors.array(),
		});
	}
	next();
};
