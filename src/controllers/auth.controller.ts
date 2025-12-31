import type { Response } from "express";
import type { LoginRequest, RegisterRequest } from "@/dto/auth.dto";
import { registerService, loginService } from "@/services/auth.service";
import type { ApiResponse } from "@/types/response";

// 新規登録
export const postRegister = async (
	req: RegisterRequest,
	res: Response
): Promise<void> => {
	const token = await registerService(req.body);

	const response: ApiResponse<{ token: string }> = {
		success: true,
		data: { token },
	};

	res.status(201).json(response);
};

// ログイン
export const postLogin = async (
	req: LoginRequest,
	res: Response
): Promise<void> => {
	const token = await loginService(req.body);

	const response: ApiResponse<{ token: string }> = {
		success: true,
		data: { token },
	};

	res.status(200).json(response);
};
