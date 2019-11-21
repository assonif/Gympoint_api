import { Router } from 'express';

import StudentController from './app/controllers/StudentsController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckInController from './app/controllers/CheckInController';
import HelporderController from './app/controllers/HelporderController';
import AnswerController from './app/controllers/AnswerController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/students', StudentController.store);
routes.post('/session', SessionController.store);

routes.post('/students/:id/checkins', CheckInController.store);
routes.get('/students/:id/checkins', CheckInController.index);

routes.post('/students/:id/help-orders', HelporderController.store);
routes.get('/students/:id/help-orders', HelporderController.index);

routes.use(authMiddleware);

routes.put('/students/:id', StudentController.update);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/registrations', RegistrationController.store);
routes.get('/registrations', RegistrationController.index);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);

routes.post('/help-orders/:id/answer', AnswerController.store);
routes.get('/help-orders', AnswerController.index);

export default routes;
