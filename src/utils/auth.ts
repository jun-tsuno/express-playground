import jwt from "jsonwebtoken";

// アクセストークンの生成
export const generateAccessToken = (userId: string, email: string): string => {
	const ACCESS_TOKEN_EXPIRES_IN = "1h";

	return jwt.sign({ userId, email }, process.env.JWT_SECRET as string, {
		expiresIn: ACCESS_TOKEN_EXPIRES_IN,
	});
};
