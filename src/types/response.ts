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

export interface Pagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

interface PaginatedResponse<T> {
	success: true;
	data: T[];
	meta: Pagination;
}

/**
 * 統一レスポンス型（成功またはエラー）
 */
export type ApiResponse<T> =
	| SuccessResponse<T>
	| PaginatedResponse<T>
	| ErrorResponse;
