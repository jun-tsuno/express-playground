import { AppDataSource } from "@/db/data-source.js";
import { Task } from "@/db/entities/task.js";
import { NotFoundError } from "@/utils/errors.js";
import type { CreateTaskDto, UpdateTaskDto } from "@/dto/task.dto.js";

const taskRepository = AppDataSource.getRepository(Task);

export const getTasksService = async (): Promise<Task[]> => {
	return await taskRepository.find();
};

export const getTaskByIdService = async (id: string): Promise<Task> => {
	const task = await taskRepository.findOneBy({ id });

	if (!task) {
		throw new NotFoundError("Task");
	}

	return task;
};

export const createTaskService = async (dto: CreateTaskDto): Promise<Task> => {
	const task = taskRepository.create({
		title: dto.title,
		description: dto.description,
		status: dto.status ?? "TODO",
	});

	return await taskRepository.save(task);
};

export const updateTaskService = async (
	id: string,
	dto: UpdateTaskDto
): Promise<Task> => {
	const task = await taskRepository.findOneBy({ id });

	if (!task) {
		throw new NotFoundError("Task");
	}

	return await taskRepository.save({ ...task, ...dto });
};

export const deleteTaskService = async (id: string): Promise<void> => {
	const task = await taskRepository.findOneBy({ id });

	if (!task) {
		throw new NotFoundError("Task");
	}

	await taskRepository.delete(id);
};
