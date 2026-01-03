import { body } from "express-validator";

export const registerValidator = [
	body("name").notEmpty().withMessage("名前は必須です"),
	body("email")
		.isEmail()
		.withMessage("メールアドレスは有効な形式で入力してください"),
	body("password")
		.isLength({ min: 8 })
		.withMessage("パスワードは8文字以上で入力してください"),
];

export const loginValidator = [
	body("email")
		.isEmail()
		.withMessage("メールアドレスは有効な形式で入力してください"),
	body("password").notEmpty().withMessage("パスワードは必須です"),
];

export const refreshValidator = [
	body("refreshToken").notEmpty().withMessage("リフレッシュトークンは必須です"),
];
