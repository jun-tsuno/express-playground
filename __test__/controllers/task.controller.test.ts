import { vi, describe, test, expect, beforeEach } from "vitest";
import { mockReq, mockRes } from "sinon-express-mock";
import type {
	GetTasksRequest,
	GetTaskRequest,
	CreateTaskRequest,
	UpdateTaskRequest,
	DeleteTaskRequest,
} from "src/dto/task.dto";
import type { Task } from "src/db/entities/task";
import type { User } from "src/db/entities/user";
import {
	getTasks,
	getTask,
	postTask,
	patchTask,
	deleteTask,
} from "src/controllers/task.controller";
import * as taskService from "src/services/task.service";
import { NotFoundError, ValidationError } from "src/utils/errors";

vi.mock("src/services/task.service", () => ({
	getTasksService: vi.fn(),
	getTaskByIdService: vi.fn(),
	createTaskService: vi.fn(),
	updateTaskService: vi.fn(),
	deleteTaskService: vi.fn(),
}));

const createMockUser = (overrides: Partial<User> = {}): User => ({
	id: "test-user-id",
	email: "test@example.com",
	name: "Test User",
	passwordHash: "test-password-hash",
	refreshToken: "test-refresh-token",
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides,
});

const createMockTask = (overrides: Partial<Task> = {}): Task => ({
	id: "1",
	title: "Task1",
	description: "Description1",
	status: "TODO",
	createdAt: new Date(),
	updatedAt: new Date(),
	ownerId: "test-user-id",
	owner: createMockUser(),
	...overrides,
});

const mockTask = createMockTask();
const mockTasks = [
	mockTask,
	createMockTask({
		id: "2",
		title: "Task2",
		description: "Description2",
		status: "DOING",
	}),
];

describe("src/controllers/task.controller", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getTasks", () => {
		test("should return 200 and the tasks", async () => {
			vi.mocked(taskService.getTasksService).mockResolvedValue({
				tasks: mockTasks,
				pagination: {
					page: 1,
					limit: 10,
					total: 2,
					totalPages: 1,
				},
			});

			const req = mockReq({
				query: {
					page: 1,
					limit: 10,
					order: "DESC",
				},
				user: "test-user-id",
			}) as unknown as GetTasksRequest;
			const res = mockRes();

			await getTasks(req, res);

			expect(taskService.getTasksService).toHaveBeenCalledWith(
				"test-user-id",
				1,
				10,
				"DESC"
			);
			expect(res.status.calledWith(200)).toBe(true);
			expect(
				res.json.calledWith({
					success: true,
					data: mockTasks,
					meta: {
						page: 1,
						limit: 10,
						total: 2,
						totalPages: 1,
					},
				})
			).toBe(true);
		});

		test("should throw NotFoundError when task not found", async () => {
			const notFoundError = new NotFoundError("タスクが見つかりません");
			vi.mocked(taskService.getTasksService).mockRejectedValue(notFoundError);

			const req = mockReq({
				user: "user-has-no-tasks",
			}) as unknown as GetTasksRequest;
			const res = mockRes();

			await expect(getTasks(req, res)).rejects.toThrow(notFoundError);
			await expect(getTasks(req, res)).rejects.toThrow(
				"タスクが見つかりません"
			);
		});
	});

	describe("getTask", () => {
		test("should return 200 and the task", async () => {
			vi.mocked(taskService.getTaskByIdService).mockResolvedValue(mockTask);

			const req = mockReq({
				params: {
					id: "1",
				},
				user: "test-user-id",
			}) as unknown as GetTaskRequest;
			const res = mockRes();

			await getTask(req, res);

			expect(taskService.getTaskByIdService).toHaveBeenCalledWith(
				"test-user-id",
				"1"
			);
			expect(res.status.calledWith(200)).toBe(true);
			expect(
				res.json.calledWith({
					success: true,
					data: mockTask,
				})
			).toBe(true);
		});

		test("should throw NotFoundError when task not found", async () => {
			const notFoundError = new NotFoundError("タスクが見つかりません");
			vi.mocked(taskService.getTaskByIdService).mockRejectedValue(
				notFoundError
			);

			const req = mockReq({
				params: {
					id: "invalid-task-id",
				},
				user: "test-user-id",
			}) as unknown as GetTaskRequest;
			const res = mockRes();

			await expect(getTask(req, res)).rejects.toThrow(notFoundError);
			await expect(getTask(req, res)).rejects.toThrow("タスクが見つかりません");
		});
	});

	describe("postTask", () => {
		test("should return 201 and the task", async () => {
			vi.mocked(taskService.createTaskService).mockResolvedValue(mockTask);

			const req = mockReq({
				body: {
					title: "Task1",
					description: "Description1",
					status: "TODO",
				},
				user: "test-user-id",
			}) as unknown as CreateTaskRequest;
			const res = mockRes();

			await postTask(req, res);

			expect(taskService.createTaskService).toHaveBeenCalledWith(
				"test-user-id",
				{
					title: "Task1",
					description: "Description1",
					status: "TODO",
				}
			);
			expect(res.status.calledWith(201)).toBe(true);
			expect(
				res.json.calledWith({
					success: true,
					data: mockTask,
				})
			).toBe(true);
		});

		test("should throw ValidationError when invalid input", async () => {
			const validationError = new ValidationError("入力が無効です");
			vi.mocked(taskService.createTaskService).mockRejectedValue(
				validationError
			);

			const req = mockReq({
				body: {
					title: "",
				},
				user: "test-user-id",
			}) as unknown as CreateTaskRequest;
			const res = mockRes();

			await expect(postTask(req, res)).rejects.toThrow(validationError);
			await expect(postTask(req, res)).rejects.toThrow("入力が無効です");
		});
	});

	describe("patchTask", () => {
		test("should return 200 and the task", async () => {
			vi.mocked(taskService.updateTaskService).mockResolvedValue(mockTask);

			const req = mockReq({
				params: {
					id: "1",
				},
				body: {
					title: "Task1",
					description: "Description1",
					status: "TODO",
				},
				user: "test-user-id",
			}) as unknown as UpdateTaskRequest;
			const res = mockRes();

			await patchTask(req, res);

			expect(taskService.updateTaskService).toHaveBeenCalledWith(
				"test-user-id",
				"1",
				{
					title: "Task1",
					description: "Description1",
					status: "TODO",
				}
			);
			expect(res.status.calledWith(200)).toBe(true);
			expect(
				res.json.calledWith({
					success: true,
					data: mockTask,
				})
			).toBe(true);
		});
	});

	describe("deleteTask", () => {
		test("should return 200 and the message", async () => {
			vi.mocked(taskService.deleteTaskService).mockResolvedValue(undefined);

			const req = mockReq({
				params: {
					id: "1",
				},
				user: "test-user-id",
			}) as unknown as DeleteTaskRequest;
			const res = mockRes();

			await deleteTask(req, res);

			expect(taskService.deleteTaskService).toHaveBeenCalledWith(
				"test-user-id",
				"1"
			);
			expect(res.status.calledWith(200)).toBe(true);
			expect(
				res.json.calledWith({
					success: true,
					data: { message: "タスクを削除しました" },
				})
			).toBe(true);
		});
	});
});
