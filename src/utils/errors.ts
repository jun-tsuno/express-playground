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
		super(
			404,
			`${resource.toUpperCase()}_NOT_FOUND`,
			`${resource}が見つかりません`
		);
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
	constructor(message = "認証エラーです") {
		super(401, "UNAUTHORIZED", message);
		this.name = "UnauthorizedError";
	}
}

// 403 Forbidden
export class ForbiddenError extends AppError {
	constructor(message = "権限がありません") {
		super(403, "FORBIDDEN", message);
		this.name = "ForbiddenError";
	}
}

// 409 Conflict
export class ConflictError extends AppError {
	constructor(resource: string) {
		super(
			409,
			`${resource.toUpperCase()}_CONFLICT`,
			`${resource}が既に存在します`
		);
		this.name = "ConflictError";
	}
}

// 500 Internal Server Error
export class InternalServerError extends AppError {
	constructor(message = "予期せぬエラーが発生しました") {
		super(500, "INTERNAL_SERVER_ERROR", message);
		this.name = "InternalServerError";
	}
}
