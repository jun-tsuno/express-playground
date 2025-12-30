import { type Request, type Response } from "express";
import {
	getTasksService,
	getTaskByIdService,
	createTaskService,
	updateTaskService,
	deleteTaskService,
} from "../services/task.service.js";

// タスク一覧を取得
export const getTasks = async (_req: Request, res: Response): Promise<void> => {
	try {
		const tasks = await getTasksService();

		if (!tasks) {
			res.status(500).json({
				success: false,
				error: {
					code: "GET_TASKS_FAILED",
					message: "Failed to get tasks",
				},
			});
		}

		res.status(200).json({
			success: true,
			data: tasks,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: {
				code: "GET_TASKS_FAILED",
				message: `Failed to get tasks: ${error}`,
			},
		});
	}
};

// タスクを取得
export const getTask = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const task = await getTaskByIdService(id);

		if (!task) {
			res.status(404).json({
				success: false,
				error: {
					code: "TASK_NOT_FOUND",
					message: "Task not found",
				},
			});
		}

		res.status(200).json({
			success: true,
			data: task,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: {
				code: "GET_TASK_BY_ID_FAILED",
				message: `Failed to get task by id: ${error}`,
			},
		});
	}
};

// タスクを作成
export const postTask = async (req: Request, res: Response): Promise<void> => {
	try {
		const { title, description } = req.body;
		const task = await createTaskService({ title, description });

		if (!task) {
			res.status(500).json({
				success: false,
				error: {
					code: "POST_TASK_FAILED",
					message: "Failed to create task",
				},
			});
		}

		res.status(201).json({
			success: true,
			data: task,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: {
				code: "POST_TASK_FAILED",
				message: `Failed to create task: ${error}`,
			},
		});
	}
};

// タスクを更新
export const patchTask = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const { title, description, status } = req.body;
		const task = await updateTaskService({ id, title, description, status });

		if (!task) {
			res.status(404).json({
				success: false,
				error: {
					code: "TASK_NOT_FOUND",
					message: "Task not found",
				},
			});
		}

		res.status(200).json({
			success: true,
			data: task,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: {
				code: "PATCH_TASK_FAILED",
				message: `Failed to update task: ${error}`,
			},
		});
	}
};

// タスクを削除
export const deleteTask = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const task = await deleteTaskService(id);

		if (!task) {
			res.status(404).json({
				success: false,
				error: {
					code: "TASK_NOT_FOUND",
					message: "Task not found",
				},
			});
		}

		res.status(200).json({
			success: true,
			data: null,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: {
				code: "DELETE_TASK_FAILED",
				message: `Failed to delete task: ${error}`,
			},
		});
	}
};
