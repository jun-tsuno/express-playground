interface SuccessResponse<T> {
	success: true;
	data: T;
}

interface ErrorResponse {
	success: false;
	error: {
		code: string;
		message: string;
		details?: Record<string, unknown>;
	};
}

interface PaginatedResponse<T> {
	success: true;
	data: T[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

/**
 * 統一レスポンス型（成功またはエラー）
 */
export type ApiResponse<T> =
	| SuccessResponse<T>
	| PaginatedResponse<T>
	| ErrorResponse;
