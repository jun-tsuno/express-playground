import { AppDataSource } from "@/db/data-source.js";
import { Task } from "@/db/entities/task.js";
import { NotFoundError, TASK_ERROR_MESSAGE } from "@/utils/errors.js";
import type { CreateTaskDto, UpdateTaskDto } from "@/dto/task.dto.js";
import type { Pagination } from "@/types/response.js";

const taskRepository = AppDataSource.getRepository(Task);

export const getTasksService = async (
	userId: string,
	page: number,
	limit: number,
	order: "ASC" | "DESC"
): Promise<{ tasks: Task[]; pagination: Pagination }> => {
	const [tasks, total] = await taskRepository.findAndCount({
		where: { ownerId: userId },
		skip: (page - 1) * limit,
		take: limit,
		order: { createdAt: order },
	});

	const pagination = {
		page,
		limit,
		total,
		totalPages: Math.ceil(total / limit),
	};

	return { tasks, pagination };
};

export const getTaskByIdService = async (
	userId: string,
	taskId: string
): Promise<Task> => {
	const task = await taskRepository.findOne({
		where: { id: taskId, ownerId: userId },
	});

	if (!task) {
		throw new NotFoundError(TASK_ERROR_MESSAGE.NOT_FOUND);
	}

	return task;
};

export const createTaskService = async (
	userId: string,
	dto: CreateTaskDto
): Promise<Task> => {
	const task = taskRepository.create({
		title: dto.title,
		description: dto.description,
		status: dto.status ?? "TODO",
		ownerId: userId,
	});

	return await taskRepository.save(task);
};

export const updateTaskService = async (
	userId: string,
	taskId: string,
	dto: UpdateTaskDto
): Promise<Task> => {
	const task = await taskRepository.findOne({
		where: { id: taskId, ownerId: userId },
	});

	if (!task) {
		throw new NotFoundError(TASK_ERROR_MESSAGE.NOT_FOUND);
	}

	return await taskRepository.save({ ...task, ...dto });
};

export const deleteTaskService = async (
	userId: string,
	taskId: string
): Promise<void> => {
	const task = await taskRepository.findOne({
		where: { id: taskId, ownerId: userId },
	});

	if (!task) {
		throw new NotFoundError(TASK_ERROR_MESSAGE.NOT_FOUND);
	}

	await taskRepository.delete(taskId);
};
