import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const { title, description } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    createTaskSchema.parse({ title, description });

    const task = await prisma.task.create({
      data: { title, description, userId },
    });
    res.status(201).json(task);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error(error);
      if (error instanceof Error) {
        res.status(500).json({ error: `Failed to create task: ${error.message}` });
      } else {
        res.status(500).json({ error: 'Failed to create task. Please try again later.' });
      }
    }
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    const tasks = await prisma.task.findMany({ where: { userId } });
    if (tasks.length === 0) {
      res.status(404).json({ message: 'No tasks found for this user' });
      return;
    }
    res.json(tasks);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Failed to fetch tasks: ${error.message}` });
    } else {
      res.status(500).json({ error: 'Failed to fetch tasks. Please try again later.' });
    }
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  if (!title && !description && completed === undefined) {
    res.status(400).json({ error: 'At least one field (title, description, or completed) is required to update the task.' });
    return;
  }

  try {
    updateTaskSchema.parse({ title, description, completed });

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, description, completed },
    });
    res.json(task);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error(error);
      if (error instanceof Error) {
        if (error.message.includes('Record to update not found')) {
          res.status(404).json({ error: 'Task not found' });
        } else {
          res.status(500).json({ error: `Failed to update task: ${error.message}` });
        }
      } else {
        res.status(500).json({ error: 'Failed to update task. Please try again later.' });
      }
    }
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('Record to delete not found')) {
        res.status(404).json({ error: 'Task not found' });
      } else {
        res.status(500).json({ error: `Failed to delete task: ${error.message}` });
      }
    } else {
      res.status(500).json({ error: 'Failed to delete task. Please try again later.' });
    }
  }
};

export const getTaskHistory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const history = await prisma.taskHistory.findMany({
      where: { taskId: parseInt(id) },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    if (history.length === 0) {
      res.status(404).json({ message: 'No history found for this task' });
      return;
    }

    res.json(history);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Failed to fetch task history: ${error.message}` });
    } else {
      res.status(500).json({ error: 'Failed to fetch task history. Please try again later.' });
    }
  }
};
