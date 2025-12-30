/**
 * カスタムエラークラス
 * アプリケーション全体で統一されたエラーハンドリングを実現
 */
export class AppError extends Error {
	constructor(
		public statusCode: number,
		public code: string,
		message: string,
		public details?: Record<string, unknown>
	) {
		super(message);
		this.name = "AppError";

		// スタックトレースをキャプチャ
		Error.captureStackTrace(this, this.constructor);
	}
}

// 404 Not Found
export class NotFoundError extends AppError {
	constructor(resource: string) {
		super(404, `${resource.toUpperCase()}_NOT_FOUND`, `${resource} not found`);
		this.name = "NotFoundError";
	}
}

// 400 Bad Request
export class ValidationError extends AppError {
	constructor(message: string, details?: Record<string, unknown>) {
		super(400, "VALIDATION_ERROR", message, details);
		this.name = "ValidationError";
	}
}

// 401 Unauthorized
export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized") {
		super(401, "UNAUTHORIZED", message);
		this.name = "UnauthorizedError";
	}
}

// 403 Forbidden
export class ForbiddenError extends AppError {
	constructor(message = "Forbidden") {
		super(403, "FORBIDDEN", message);
		this.name = "ForbiddenError";
	}
}
