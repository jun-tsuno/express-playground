import type { Request } from "express";

export interface RegisterDto {
	name: string;
	email: string;
	password: string;
}

export interface LoginDto {
	email: string;
	password: string;
}

export interface RefreshDto {
	refreshToken: string;
}

export type RegisterRequest = Request<
	Record<string, never>,
	never,
	RegisterDto
>;
export type LoginRequest = Request<Record<string, never>, never, LoginDto>;
export type RefreshRequest = Request<Record<string, never>, never, RefreshDto>;
