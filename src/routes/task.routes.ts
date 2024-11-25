import express, { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../middlewares/authMiddleware';
import { createTask, getTasks, updateTask, deleteTask, getTaskHistory } from '../controllers/task.controller';

const router = express.Router();


router.use((req: Request, res: Response, next: NextFunction) => {
  verifyJWT(req, res, next);
});

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/:id/history', getTaskHistory);

export default router;