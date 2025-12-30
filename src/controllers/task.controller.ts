import type { Response } from "express";
import {
	getTasksService,
	getTaskByIdService,
	createTaskService,
	updateTaskService,
	deleteTaskService,
} from "@/services/task.service.js";
import type {
	CreateTaskRequest,
	UpdateTaskRequest,
	GetTaskRequest,
	DeleteTaskRequest,
} from "@/dto/task.dto.js";
import type { ApiResponse } from "@/types/response.js";
import type { Task } from "@/db/entities/task.js";

// タスク一覧を取得
export const getTasks = async (_req: never, res: Response): Promise<void> => {
	const tasks = await getTasksService();

	const response: ApiResponse<Task[]> = {
		success: true,
		data: tasks,
	};

	res.status(200).json(response);
};

// タスクを取得
export const getTask = async (
	req: GetTaskRequest,
	res: Response
): Promise<void> => {
	const task = await getTaskByIdService(req.params.id);

	const response: ApiResponse<Task> = {
		success: true,
		data: task,
	};

	res.status(200).json(response);
};

// タスクを作成
export const postTask = async (
	req: CreateTaskRequest,
	res: Response
): Promise<void> => {
	const task = await createTaskService(req.body);

	const response: ApiResponse<Task> = {
		success: true,
		data: task,
	};

	res.status(201).json(response);
};

// タスクを更新
export const patchTask = async (
	req: UpdateTaskRequest,
	res: Response
): Promise<void> => {
	const task = await updateTaskService(req.params.id, req.body);

	const response: ApiResponse<Task> = {
		success: true,
		data: task,
	};

	res.status(200).json(response);
};

// タスクを削除
export const deleteTask = async (
	req: DeleteTaskRequest,
	res: Response
): Promise<void> => {
	await deleteTaskService(req.params.id);

	const response: ApiResponse<{ message: string }> = {
		success: true,
		data: { message: "Task deleted successfully" },
	};

	res.status(200).json(response);
};
