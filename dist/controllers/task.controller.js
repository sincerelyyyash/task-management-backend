"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskHistory = exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
});
const updateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    completed: zod_1.z.boolean().optional(),
});
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }
    try {
        createTaskSchema.parse({ title, description });
        const task = yield prisma.task.create({
            data: { title, description, userId },
        });
        res.status(201).json(task);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ error: `Failed to create task: ${error.message}` });
            }
            else {
                res.status(500).json({ error: 'Failed to create task. Please try again later.' });
            }
        }
    }
});
exports.createTask = createTask;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }
    try {
        const tasks = yield prisma.task.findMany({ where: { userId } });
        if (tasks.length === 0) {
            res.status(404).json({ message: 'No tasks found for this user' });
            return;
        }
        res.json(tasks);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Failed to fetch tasks: ${error.message}` });
        }
        else {
            res.status(500).json({ error: 'Failed to fetch tasks. Please try again later.' });
        }
    }
});
exports.getTasks = getTasks;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    if (!title && !description && completed === undefined) {
        res.status(400).json({ error: 'At least one field (title, description, or completed) is required to update the task.' });
        return;
    }
    try {
        updateTaskSchema.parse({ title, description, completed });
        const task = yield prisma.task.update({
            where: { id: parseInt(id) },
            data: { title, description, completed },
        });
        res.json(task);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            console.error(error);
            if (error instanceof Error) {
                if (error.message.includes('Record to update not found')) {
                    res.status(404).json({ error: 'Task not found' });
                }
                else {
                    res.status(500).json({ error: `Failed to update task: ${error.message}` });
                }
            }
            else {
                res.status(500).json({ error: 'Failed to update task. Please try again later.' });
            }
        }
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.task.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Record to delete not found')) {
                res.status(404).json({ error: 'Task not found' });
            }
            else {
                res.status(500).json({ error: `Failed to delete task: ${error.message}` });
            }
        }
        else {
            res.status(500).json({ error: 'Failed to delete task. Please try again later.' });
        }
    }
});
exports.deleteTask = deleteTask;
const getTaskHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const history = yield prisma.taskHistory.findMany({
            where: { taskId: parseInt(id) },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });
        if (history.length === 0) {
            res.status(404).json({ message: 'No history found for this task' });
            return;
        }
        res.json(history);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: `Failed to fetch task history: ${error.message}` });
        }
        else {
            res.status(500).json({ error: 'Failed to fetch task history. Please try again later.' });
        }
    }
});
exports.getTaskHistory = getTaskHistory;
