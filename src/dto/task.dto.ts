import type { Request } from "express";

export interface CreateTaskDto {
	title: string;
	description?: string;
	status?: "TODO" | "DOING" | "DONE";
}

export interface UpdateTaskDto {
	title?: string;
	description?: string;
	status?: "TODO" | "DOING" | "DONE";
}

export interface GetTasksQueryDto {
	page?: number;
	limit?: number;
	order?: "ASC" | "DESC";
	status?: "TODO" | "DOING" | "DONE";
}

export interface TaskParamsDto {
	id: string;
}

export type GetTasksRequest = Request<
	Record<string, never>,
	never,
	never,
	GetTasksQueryDto
>;

export type CreateTaskRequest = Request<
	Record<string, never>,
	never,
	CreateTaskDto
>;

export type UpdateTaskRequest = Request<TaskParamsDto, never, UpdateTaskDto>;

export type GetTaskRequest = Request<TaskParamsDto>;

export type DeleteTaskRequest = Request<TaskParamsDto>;
