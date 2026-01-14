import { body, param, query } from "express-validator";

// 一覧取得
export const getTasksValidator = [
	query("page")
		.optional()
		.isInt({ min: 1 })
		.withMessage("ページは1以上です")
		.toInt(),
	query("limit")
		.optional()
		.isInt({ min: 1, max: 50 })
		.withMessage("1〜50の間で指定してください")
		.toInt(),
	query("order")
		.optional()
		.isIn(["ASC", "DESC"])
		.withMessage("ソート順はASCまたはDESCで入力してください"),
];

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
