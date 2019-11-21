import Helporder from '../models/Helporder';
import Student from '../models/Student';

class HelporderController {
  async store(req, res) {
    const student_id = req.params.id;
    const { question } = req.body;

    /**
     * Check if student exists
     */
    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    const helporder = await Helporder.create({ question, student_id });

    return res.json(helporder);
  }

  async index(req, res) {
    const student_id = req.params.id;

    /**
     * Check if student exists
     */
    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    /**
     * Check if student has help orders
     */

    const helporders = await Helporder.findAll({ where: { student_id } });

    if (helporders.length === 0) {
      return res.status(400).json({ error: 'This student has 0 help orders' });
    }

    return res.json(helporders);
  }
}

export default new HelporderController();
