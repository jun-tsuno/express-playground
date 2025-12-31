import { User } from "@/db/entities/user";
import type { LoginDto, RegisterDto } from "@/dto/auth.dto";
import { AppDataSource } from "@/db/data-source";
import { ConflictError, NotFoundError } from "@/utils/errors";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "@/utils/errors";
import { generateAccessToken } from "@/utils/auth";

// 新規登録
export const registerService = async (dto: RegisterDto): Promise<string> => {
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

	return token;
};

// ログイン
export const loginService = async (dto: LoginDto): Promise<string> => {
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

	return token;
};
