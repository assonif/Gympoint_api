import * as Yup from 'yup';
import { addMonths, parseISO, format, isBefore } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.string().required(),
      student_id: Yup.string().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

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
     * Check if student is already registrated
     */

    const registrationExists = await Registration.findOne({
      where: { student_id },
    });
    if (registrationExists) {
      return res
        .status(400)
        .json({ error: 'This student is already registrated' });
    }

    /**
     * Check start date
     */

    if (start_date) {
      const date = parseISO(start_date);

      if (isBefore(date, new Date())) {
        return res.status(400).json({ error: 'Past dates are not permitted' });
      }
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

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.string(),
      student_id: Yup.string(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const register = await Registration.findByPk(req.params.id);

    if (!register) {
      return res.status(401).json({ error: 'Register not found' });
    }

    const { plan_id, student_id, start_date } = req.body;

    /**
     * Check if plan exists
     */
    if (plan_id) {
      const planExists = await Plan.findByPk(plan_id);

      if (!planExists) {
        return res.status(400).json({ error: 'This plan does not exists' });
      }
    }

    /**
     * Check if student exists
     */
    if (student_id) {
      const studentExists = await Student.findByPk(student_id);

      if (!studentExists) {
        return res.status(400).json({ error: 'This student does not exists' });
      }
    }

    /**
     * Check start date
     */

    if (start_date) {
      const date = parseISO(start_date);

      if (isBefore(date, new Date())) {
        return res.status(400).json({ error: 'Past dates are not permitted' });
      }
    }

    const updated = await register.update(req.body);

    return res.json(updated);
  }

  async delete(req, res) {
    const register = await Registration.findByPk(req.params.id);

    if (!register) {
      return res.status(400).json({ error: 'This register does not exists' });
    }

    await register.destroy().then(deletedPet => {
      return res.json(deletedPet);
    });

    return res.status(400).json({ error: 'You cannot delete this register' });
  }
}

export default new RegistrationController();
