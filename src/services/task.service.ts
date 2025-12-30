import { AppDataSource } from "../db/data-source.js";
import { Task } from "../db/entities/task.js";
import type { CreateTaskDto, UpdateTaskDto } from "../dto/task.js";

export const getTasksService = async (): Promise<Task[] | null> => {
	try {
		const taskRepository = AppDataSource.getRepository(Task);
		const tasks = await taskRepository.find();

		return tasks;
	} catch (error) {
		// エラー処理
		console.error(error);
		return null;
	}
};

export const getTaskByIdService = async (id: string): Promise<Task | null> => {
	try {
		const taskRepository = AppDataSource.getRepository(Task);
		const task = await taskRepository.findOneBy({ id });

		if (!task) {
			return null;
		}

		return task;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const createTaskService = async (
	dto: CreateTaskDto
): Promise<Task | null> => {
	try {
		const taskRepository = AppDataSource.getRepository(Task);
		const task = new Task();
		task.title = dto.title;
		task.description = dto.description;
		task.status = dto.status ?? "TODO";

		const newTask = await taskRepository.save(task);
		return newTask;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const updateTaskService = async (
	id: string,
	dto: UpdateTaskDto
): Promise<Task | null> => {
	try {
		const taskRepository = AppDataSource.getRepository(Task);
		const task = await taskRepository.findOneBy({ id });

		if (!task) {
			return null;
		}

		const updatedTask = await taskRepository.save({
			...task,
			...dto,
		});

		return updatedTask;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const deleteTaskService = async (id: string): Promise<boolean> => {
	try {
		const taskRepository = AppDataSource.getRepository(Task);
		const task = await taskRepository.findOneBy({ id });
		if (!task) {
			return false;
		}
		await taskRepository.delete(id);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};
