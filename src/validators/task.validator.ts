import { body, param } from "express-validator";

// 作成
export const createTaskValidator = [
	body("title").notEmpty().withMessage("必須項目です"),
	body("description")
		.optional()
		.isString()
		.withMessage("文字列で入力してください"),
	body("status")
		.optional()
		.isIn(["TODO", "DOING", "DONE"])
		.withMessage("形式に誤りがあります"),
];

// 更新
export const updateTaskValidator = [
	param("id").notEmpty().withMessage("IDは必須です"),
	body("title").optional().notEmpty().withMessage("タイトルは空にできません"),
	body("description")
		.optional()
		.isString()
		.withMessage("文字列で入力してください"),
	body("status")
		.optional()
		.isIn(["TODO", "DOING", "DONE"])
		.withMessage("形式に誤りがあります"),
];

// idパラメータ
export const taskIdValidator = [
	param("id").notEmpty().withMessage("IDは必須です"),
];
