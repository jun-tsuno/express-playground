import { type Response } from "express";
import {
	getTasksService,
	getTaskByIdService,
	createTaskService,
	updateTaskService,
	deleteTaskService,
} from "../services/task.service.js";
import type {
	CreateTaskRequest,
	UpdateTaskRequest,
	GetTaskRequest,
	DeleteTaskRequest,
} from "../dto/task.js";
import type { ApiResponse } from "../types/response.js";
import type { Task } from "../db/entities/task.js";

// タスク一覧を取得
export const getTasks = async (_req: never, res: Response): Promise<void> => {
	try {
		const tasks = await getTasksService();

		if (!tasks) {
			const response: ApiResponse<never> = {
				success: false,
				error: {
					code: "GET_TASKS_FAILED",
					message: "Failed to get tasks",
				},
			};
			res.status(500).json(response);
			return;
		}

		const response: ApiResponse<Task[]> = {
			success: true,
			data: tasks,
		};
		res.status(200).json(response);
	} catch (error) {
		const response: ApiResponse<never> = {
			success: false,
			error: {
				code: "GET_TASKS_FAILED",
				message: `Failed to get tasks: ${error}`,
			},
		};
		res.status(500).json(response);
	}
};

// タスクを取得
export const getTask = async (
	req: GetTaskRequest,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const task = await getTaskByIdService(id);

		if (!task) {
			const response: ApiResponse<never> = {
				success: false,
				error: {
					code: "TASK_NOT_FOUND",
					message: "Task not found",
				},
			};
			res.status(404).json(response);
			return;
		}

		const response: ApiResponse<Task> = {
			success: true,
			data: task,
		};
		res.status(200).json(response);
	} catch (error) {
		const response: ApiResponse<never> = {
			success: false,
			error: {
				code: "GET_TASK_BY_ID_FAILED",
				message: `Failed to get task by id: ${error}`,
			},
		};
		res.status(500).json(response);
	}
};

// タスクを作成
export const postTask = async (
	req: CreateTaskRequest,
	res: Response
): Promise<void> => {
	try {
		const dto = req.body;
		const task = await createTaskService(dto);

		if (!task) {
			const response: ApiResponse<never> = {
				success: false,
				error: {
					code: "POST_TASK_FAILED",
					message: "Failed to create task",
				},
			};
			res.status(500).json(response);
			return;
		}

		const response: ApiResponse<Task> = {
			success: true,
			data: task,
		};
		res.status(201).json(response);
	} catch (error) {
		const response: ApiResponse<never> = {
			success: false,
			error: {
				code: "POST_TASK_FAILED",
				message: `Failed to create task: ${error}`,
			},
		};
		res.status(500).json(response);
	}
};

// タスクを更新
export const patchTask = async (
	req: UpdateTaskRequest,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const dto = req.body;
		const task = await updateTaskService(id, dto);

		if (!task) {
			const response: ApiResponse<never> = {
				success: false,
				error: {
					code: "TASK_NOT_FOUND",
					message: "Task not found",
				},
			};
			res.status(404).json(response);
			return;
		}

		const response: ApiResponse<Task> = {
			success: true,
			data: task,
		};
		res.status(200).json(response);
	} catch (error) {
		const response: ApiResponse<never> = {
			success: false,
			error: {
				code: "PATCH_TASK_FAILED",
				message: `Failed to update task: ${error}`,
			},
		};
		res.status(500).json(response);
	}
};

// タスクを削除
export const deleteTask = async (
	req: DeleteTaskRequest,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const task = await deleteTaskService(id);

		if (!task) {
			const response: ApiResponse<never> = {
				success: false,
				error: {
					code: "TASK_NOT_FOUND",
					message: "Task not found",
				},
			};
			res.status(404).json(response);
			return;
		}

		const response: ApiResponse<null> = {
			success: true,
			data: null,
		};
		res.status(200).json(response);
	} catch (error) {
		const response: ApiResponse<never> = {
			success: false,
			error: {
				code: "DELETE_TASK_FAILED",
				message: `Failed to delete task: ${error}`,
			},
		};
		res.status(500).json(response);
	}
};
