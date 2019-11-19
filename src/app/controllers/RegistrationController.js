// import * as Yup from 'yup';
import { addMonths, parseISO, format } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
  async store(req, res) {
    const { plan_id, student_id, start_date } = req.body;

    /**
     * Check if plan exists
     */
    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res.status(400).json({ error: 'This plan does not exists' });
    }

    /**
     * Check if student exists
     */
    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    /**
     * Adding months to get "end_date"
     */
    const startDate = parseISO(start_date);
    const endDate = addMonths(startDate, planExists.duration);

    const end_date = format(endDate, "yyyy-MM-dd'T'HH:mm:ssxxx");

    /**
     * Calculating the price
     */

    const price = planExists.price * planExists.duration;

    const registration = await Registration.create({
      plan_id,
      student_id,
      start_date,
      end_date,
      price,
    });

    return res.json(registration);
  }

  async index(req, res) {
    const registrations = await Registration.findAll({
      attributes: [
        'id',
        'price',
        'start_date',
        'end_date',
        'student_id',
        'plan_id',
      ],
    });

    return res.json(registrations);
  }
}

export default new RegistrationController();
