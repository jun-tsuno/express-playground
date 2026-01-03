import type { Response } from "express";
import type {
	LoginRequest,
	RegisterRequest,
	RefreshRequest,
} from "@/dto/auth.dto";
import {
	registerService,
	loginService,
	refreshService,
} from "@/services/auth.service";
import type { ApiResponse } from "@/types/response";

// 新規登録
export const postRegister = async (
	req: RegisterRequest,
	res: Response
): Promise<void> => {
	const { token, refreshToken } = await registerService(req.body);

	const response: ApiResponse<{ token: string; refreshToken: string }> = {
		success: true,
		data: { token, refreshToken },
	};

	res.status(201).json(response);
};

// ログイン
export const postLogin = async (
	req: LoginRequest,
	res: Response
): Promise<void> => {
	const { token, refreshToken } = await loginService(req.body);

	const response: ApiResponse<{ token: string; refreshToken: string }> = {
		success: true,
		data: { token, refreshToken },
	};

	res.status(200).json(response);
};

// リフレッシュトークン
export const postRefresh = async (
	req: RefreshRequest,
	res: Response
): Promise<void> => {
	const { token, refreshToken } = refreshService(req.body);

	const response: ApiResponse<{ token: string; refreshToken: string }> = {
		success: true,
		data: { token, refreshToken },
	};

	res.status(200).json(response);
};
