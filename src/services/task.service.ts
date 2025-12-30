import { AppDataSource } from "../db/data-source.js";
import { Task } from "../db/entities/task.js";

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

export const createTaskService = async ({
	title,
	description,
}: {
	title: string;
	description?: string;
}): Promise<Task | null> => {
	try {
		const taskRepository = AppDataSource.getRepository(Task);
		const task = new Task();
		task.title = title;
		task.description = description;
		task.status = "TODO";

		const newTask = await taskRepository.save(task);
		return newTask;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const updateTaskService = async ({
	id,
	title,
	description,
	status,
}: {
	id: string;
	title?: string;
	description?: string;
	status?: "TODO" | "DOING" | "DONE";
}): Promise<Task | null> => {
	try {
		const taskRepository = AppDataSource.getRepository(Task);
		const task = await taskRepository.findOneBy({ id });

		if (!task) {
			return null;
		}

		const updatedTask = await taskRepository.save({
			...task,
			title,
			description,
			status,
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
