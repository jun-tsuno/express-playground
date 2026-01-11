import "jsonwebtoken";

declare module "jsonwebtoken" {
	interface JwtPayload {
		userId: string;
		email: string;
	}
}
