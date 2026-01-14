import type { Response } from "express";
import {
	getTasksService,
	getTaskByIdService,
	createTaskService,
	updateTaskService,
	deleteTaskService,
} from "@/services/task.service.js";
import type {
	GetTasksRequest,
	CreateTaskRequest,
	UpdateTaskRequest,
	GetTaskRequest,
	DeleteTaskRequest,
} from "@/dto/task.dto.js";
import type { ApiResponse } from "@/types/response.js";
import type { Task } from "@/db/entities/task.js";

// タスク一覧を取得
export const getTasks = async (
	req: GetTasksRequest,
	res: Response
): Promise<void> => {
	if (!req.user) return;

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const order = req.query.order || "DESC";

	const { tasks, pagination } = await getTasksService(
		req.user,
		page,
		limit,
		order
	);

	const response: ApiResponse<Task[]> = {
		success: true,
		data: tasks,
		meta: pagination,
	};

	res.status(200).json(response);
};

// タスクを取得
export const getTask = async (
	req: GetTaskRequest,
	res: Response
): Promise<void> => {
	if (!req.user) return;

	const task = await getTaskByIdService(req.user, req.params.id);

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
	if (!req.user) return;

	const task = await createTaskService(req.user, req.body);

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
	if (!req.user) return;
	const task = await updateTaskService(req.user, req.params.id, req.body);

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
	if (!req.user) return;

	await deleteTaskService(req.user, req.params.id);

	const response: ApiResponse<{ message: string }> = {
		success: true,
		data: { message: "タスクを削除しました" },
	};

	res.status(200).json(response);
};
