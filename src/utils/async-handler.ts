import type { Request, Response, NextFunction } from "express";

type AsyncHandler<T = Request> = (
	req: T,
	res: Response,
	next: NextFunction
) => Promise<void>;

/**
 * 非同期ルートハンドラーをラップし、エラーを自動的にnext()に渡す
 * これによりコントローラーでtry-catchが不要になる
 */
export const asyncHandler = <T = Request>(fn: AsyncHandler<T>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req as T, res, next)).catch(next);
	};
};
