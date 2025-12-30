// TypeORM データソース設定
import { DataSource } from "typeorm";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { User } from "./entities/user.js";
import { Task } from "./entities/task.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
	type: "better-sqlite3",
	database: join(__dirname, "database.sqlite"),
	synchronize: false, // マイグレーションで管理する
	logging: false,
	entities: [User, Task],
	migrations: [join(__dirname, "migrations", "*.ts")],
});
