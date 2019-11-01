import { Router } from 'express';

import StudentController from './app/controllers/StudentsController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/students', StudentController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/students/:id', StudentController.update);

export default routes;
