import type { Response, Request } from "express";
import type { LoginRequest, RegisterRequest } from "@/dto/auth.dto";
import {
	registerService,
	loginService,
	refreshService,
} from "@/services/auth.service";
import type { ApiResponse } from "@/types/response";
import { UnauthorizedError } from "@/utils/errors";
import { tokenCookie, refreshTokenCookie } from "@/utils/auth";

// 新規登録
export const postRegister = async (
	req: RegisterRequest,
	res: Response
): Promise<void> => {
	await registerService(req.body);

	const response: ApiResponse<null> = {
		success: true,
		data: null,
	};

	res.status(201).json(response);
};

// ログイン
export const postLogin = async (
	req: LoginRequest,
	res: Response
): Promise<void> => {
	const { token, refreshToken } = await loginService(req.body);

	// httpOnlyにcookieを設定
	res.cookie(tokenCookie.key, token, tokenCookie.options);
	res.cookie(refreshTokenCookie.key, refreshToken, refreshTokenCookie.options);

	const response: ApiResponse<null> = {
		success: true,
		data: null,
	};

	res.status(200).json(response);
};

// リフレッシュトークン
export const postRefresh = async (
	req: Request,
	res: Response
): Promise<void> => {
	const oldRefreshToken = req.cookies?.refreshToken;

	if (!oldRefreshToken) {
		throw new UnauthorizedError("リフレッシュトークンが見つかりません");
	}

	const { token, refreshToken } = refreshService(oldRefreshToken);

	// httpOnlyにcookieを設定
	res.cookie(tokenCookie.key, token, tokenCookie.options);
	res.cookie(refreshTokenCookie.key, refreshToken, refreshTokenCookie.options);

	const response: ApiResponse<null> = {
		success: true,
		data: null,
	};

	res.status(200).json(response);
};
