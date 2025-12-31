import { AppDataSource } from "@/db/data-source.js";
import { Task } from "@/db/entities/task.js";
import { NotFoundError } from "@/utils/errors.js";
import type { CreateTaskDto, UpdateTaskDto } from "@/dto/task.dto.js";

const taskRepository = AppDataSource.getRepository(Task);

export const getTasksService = async (userId: string): Promise<Task[]> => {
	return await taskRepository.find({ where: { ownerId: userId } });
};

export const getTaskByIdService = async (
	userId: string,
	taskId: string
): Promise<Task> => {
	const task = await taskRepository.findOne({
		where: { id: taskId, ownerId: userId },
	});

	if (!task) {
		throw new NotFoundError("Task");
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
		throw new NotFoundError("Task");
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
		throw new NotFoundError("Task");
	}

	await taskRepository.delete(taskId);
};
