import { User } from "@/db/entities/user.js";
import type { LoginDto, RegisterDto } from "@/dto/auth.dto.js";
import { AppDataSource } from "@/db/data-source.js";
import { ConflictError, NotFoundError } from "@/utils/errors.js";
import bcrypt from "bcrypt";
import { UnauthorizedError, AUTH_ERROR_MESSAGE } from "@/utils/errors.js";
import {
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
} from "@/utils/auth.js";

const userRepository = AppDataSource.getRepository(User);

// 新規登録
export const registerService = async (dto: RegisterDto): Promise<void> => {
	const user = await userRepository.findOneBy({ email: dto.email });

	if (user) {
		throw new ConflictError(AUTH_ERROR_MESSAGE.CONFLICT);
	}

	// パスワードの暗号化
	const hashedPassword = await bcrypt.hash(dto.password, 10);

	// ユーザーの作成
	await userRepository.save({
		name: dto.name,
		email: dto.email,
		passwordHash: hashedPassword,
	});
};

// ログイン
export const loginService = async (
	dto: LoginDto
): Promise<{ token: string; refreshToken: string }> => {
	const user = await userRepository.findOneBy({ email: dto.email });

	if (!user) {
		throw new NotFoundError(AUTH_ERROR_MESSAGE.NOT_FOUND);
	}

	// パスワード検証
	const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
	if (!isMatch) {
		throw new UnauthorizedError(AUTH_ERROR_MESSAGE.DEFAULT);
	}

	// トークンの生成
	const token = generateAccessToken(user.id, user.email);
	const refreshToken = generateRefreshToken(user.id, user.email);

	return { token, refreshToken };
};

// リフレッシュトークンの検証と生成
export const refreshService = (
	refreshToken: string
): { token: string; refreshToken: string } => {
	const result = verifyRefreshToken(refreshToken);

	if (!result.success) {
		throw new UnauthorizedError(result.error);
	}

	const token = generateAccessToken(
		result.payload.userId,
		result.payload.email
	);
	const newRefreshToken = generateRefreshToken(
		result.payload.userId,
		result.payload.email
	);

	return { token, refreshToken: newRefreshToken };
};
