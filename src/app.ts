import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

export default app;
