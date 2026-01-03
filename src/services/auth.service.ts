import { User } from "@/db/entities/user";
import type { LoginDto, RegisterDto, RefreshDto } from "@/dto/auth.dto";
import { AppDataSource } from "@/db/data-source";
import { ConflictError, NotFoundError } from "@/utils/errors";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "@/utils/errors";
import {
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
} from "@/utils/auth";

// 新規登録
export const registerService = async (
	dto: RegisterDto
): Promise<{ token: string; refreshToken: string }> => {
	const userRepository = AppDataSource.getRepository(User);
	const user = await userRepository.findOneBy({ email: dto.email });

	if (user) {
		throw new ConflictError("User");
	}

	// パスワードの暗号化
	const hashedPassword = await bcrypt.hash(dto.password, 10);

	// ユーザーの作成
	const createdUser = await userRepository.save({
		name: dto.name,
		email: dto.email,
		passwordHash: hashedPassword,
	});

	// トークンの生成
	const token = generateAccessToken(createdUser.id, createdUser.email);
	const refreshToken = generateRefreshToken(createdUser.id, createdUser.email);

	return { token, refreshToken };
};

// ログイン
export const loginService = async (
	dto: LoginDto
): Promise<{ token: string; refreshToken: string }> => {
	const userRepository = AppDataSource.getRepository(User);
	const user = await userRepository.findOneBy({ email: dto.email });

	if (!user) {
		throw new NotFoundError("User");
	}

	// パスワード検証
	const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
	if (!isMatch) {
		throw new UnauthorizedError("無効な認証情報です");
	}

	// トークンの生成
	const token = generateAccessToken(user.id, user.email);
	const refreshToken = generateRefreshToken(user.id, user.email);

	return { token, refreshToken };
};

// リフレッシュトークンの検証
export const refreshService = (
	dto: RefreshDto
): { token: string; refreshToken: string } => {
	const { refreshToken } = dto;

	try {
		const decoded = verifyRefreshToken(refreshToken);

		// 新しいトークンとリフレッシュトークンの生成
		const token = generateAccessToken(decoded.userId, decoded.email);
		const newRefreshToken = generateRefreshToken(decoded.userId, decoded.email);

		return { token, refreshToken: newRefreshToken };
	} catch {
		throw new UnauthorizedError("無効なリフレッシュトークンです");
	}
};
