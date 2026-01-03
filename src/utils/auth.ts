import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

// アクセストークンの生成
export const generateAccessToken = (userId: string, email: string): string => {
	const ACCESS_TOKEN_EXPIRES_IN = "1h";

	return jwt.sign({ userId, email }, process.env.JWT_SECRET as string, {
		expiresIn: ACCESS_TOKEN_EXPIRES_IN,
	});
};

// リフレッシュトークンの生成
export const generateRefreshToken = (userId: string, email: string): string => {
	const REFRESH_TOKEN_EXPIRES_IN = "7d";

	return jwt.sign(
		{ userId, email },
		process.env.REFRESH_TOKEN_SECRET as string,
		{
			expiresIn: REFRESH_TOKEN_EXPIRES_IN,
		}
	);
};

// アクセストークンの検証
export const verifyAccessToken = (token: string): JwtPayload => {
	return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};

// リフレッシュトークンの検証
export const verifyRefreshToken = (refreshToken: string): JwtPayload => {
	return jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET as string
	) as JwtPayload;
};
