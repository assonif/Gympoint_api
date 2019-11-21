import * as Yup from 'yup';

import Helporder from '../models/Helporder';

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { id } = req.params;

    /**
     * Check if help order exists
     */

    const helporder = await Helporder.findByPk(id);

    if (!helporder) {
      return res.status(400).json({ error: 'This help order does not exists' });
    }
    if (helporder.answer !== null) {
      return res
        .status(400)
        .json({ error: 'This help order has already answered' });
    }

    const { answer } = req.body;
    const answered = await helporder.update({ answer, answer_at: new Date() });

    return res.json(answered);
  }

  async index(req, res) {
    const helporder = await Helporder.findAll({
      where: { answer: null },
      attributes: ['id', 'question', 'created_at', 'student_id'],
    });

    return res.json(helporder);
  }
}

export default new AnswerController();
