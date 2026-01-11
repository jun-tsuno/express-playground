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
import jwt, { JwtPayload } from "jsonwebtoken";

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

	// リフレッシュトークンをDBに保存
	await userRepository.update(user.id, { refreshToken });

	return { token, refreshToken };
};

// リフレッシュトークンの検証と生成
export const refreshService = async (
	refreshToken: string
): Promise<{ token: string; refreshToken: string }> => {
	// トークンの検証
	const result = verifyRefreshToken(refreshToken);
	if (!result.success) {
		throw new UnauthorizedError(result.error);
	}

	// ユーザーの検証
	const user = await userRepository.findOneBy({ id: result.payload.userId });
	if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
		throw new UnauthorizedError(AUTH_ERROR_MESSAGE.INVALID_REFRESH_TOKEN);
	}

	const token = generateAccessToken(
		result.payload.userId,
		result.payload.email
	);
	const newRefreshToken = generateRefreshToken(
		result.payload.userId,
		result.payload.email
	);

	await userRepository.update(result.payload.userId, {
		refreshToken: newRefreshToken,
	});

	return { token, refreshToken: newRefreshToken };
};

// ログアウト
export const logoutService = async (refreshToken: string): Promise<void> => {
	if (!refreshToken) return;

	const decoded = jwt.decode(refreshToken) as JwtPayload | null;
	if (!decoded?.userId) return;

	await userRepository.update(decoded.userId, { refreshToken: null });
};
