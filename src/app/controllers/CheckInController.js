import { isAfter, subDays } from 'date-fns';

import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Registration from '../models/Registration';

class CheckInController {
  async store(req, res) {
    const student_id = req.params.id;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'This id does not exists' });
    }

    const registrationExists = await Registration.findOne({
      where: { student_id },
    });
    if (!registrationExists) {
      return res.status(400).json({ error: 'You are not registered' });
    }
    const checkins = await Checkin.findAll({
      where: { student_id },
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['createdAt'],
    });

    if (checkins.length > 4) {
      const date = checkins[4];

      if (isAfter(date, subDays(new Date(), 7))) {
        return res
          .status(400)
          .json({ error: 'You have already reached the week checkins limit' });
      }
    }

    /**
     * Precisa implementar verificação diária
     */

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const student_id = req.params.id;

    const checkins = await Checkin.findAll({
      where: { student_id },
      order: [['created_at', 'DESC']],
      attributes: ['createdAt'],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(checkins);
  }
}

export default new CheckInController();
