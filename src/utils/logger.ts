import pino, { type Logger } from "pino";
import pinoHttp, { type HttpLogger } from "pino-http";

const isProduction = process.env.NODE_ENV === "production";

/**
 * アプリケーション全体で使用するロガーインスタンス
 * - 本番環境: INFO レベル以上を出力
 * - 開発環境: DEBUG レベル以上を出力
 */
export const logger: Logger = pino({
	level: isProduction ? "info" : "debug",
	transport: {
		targets: [
			{
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "HH:MM:ss",
					ignore: "pid,hostname",
				},
			},
			// {
			// 	target: "pino/file",
			// 	options: {
			// 		destination: "logs/app.log",
			// 		mkdir: true,
			// 	},
			// },
		],
	},
});

/**
 * HTTPリクエストログ用ミドルウェア
 */
export const httpLogger: HttpLogger = pinoHttp({
	logger,
	autoLogging: {
		ignore: (req) => {
			return req.url === "/health";
		},
	},
	// ログメッセージ
	customSuccessMessage: (req, res) => {
		return `${req.method} ${req.url} ${res.statusCode}`;
	},
	customErrorMessage: (req, res) => {
		return `${req.method} ${req.url} ${res.statusCode}`;
	},
	// 表示項目
	serializers: {
		req: (req) => ({
			method: req.method,
			url: req.url,
			query: req.query,
			params: req.params,
		}),
		res: (res) => ({
			statusCode: res.statusCode,
			body: res.body,
		}),
	},
});
