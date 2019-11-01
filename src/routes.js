import { Router } from 'express';

import StudentController from './app/controllers/StudentsController';

const routes = new Router();

routes.post('/students', StudentController.store);

routes.put('/students/:id', StudentController.update);

export default routes;
