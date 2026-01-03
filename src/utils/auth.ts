import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { CookieOptions } from "express";

// トークン設定
const TOKEN_CONFIG = {
	token: {
		cookieKey: "token",
		expiresInSec: 60 * 60, // 1時間
	},
	refresh: {
		cookieKey: "refreshToken",
		expiresInSec: 7 * 24 * 60 * 60, // 7日
	},
};

// アクセストークンの生成
export const generateAccessToken = (userId: string, email: string): string => {
	return jwt.sign({ userId, email }, process.env.JWT_SECRET as string, {
		expiresIn: TOKEN_CONFIG.token.expiresInSec,
	});
};

// リフレッシュトークンの生成
export const generateRefreshToken = (userId: string, email: string): string => {
	return jwt.sign(
		{ userId, email },
		process.env.REFRESH_TOKEN_SECRET as string,
		{
			expiresIn: TOKEN_CONFIG.refresh.expiresInSec,
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

export const getCookieOptions = ({
	maxAgeSec,
}: {
	maxAgeSec: number;
}): CookieOptions => {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: maxAgeSec * 1000, // ミリ秒に変換
	};
};

// アクセストークンのcookie
export const tokenCookie = {
	key: TOKEN_CONFIG.token.cookieKey,
	options: getCookieOptions({ maxAgeSec: TOKEN_CONFIG.token.expiresInSec }),
};

// リフレッシュトークンのcookie
export const refreshTokenCookie = {
	key: TOKEN_CONFIG.refresh.cookieKey,
	options: getCookieOptions({ maxAgeSec: TOKEN_CONFIG.refresh.expiresInSec }),
};
