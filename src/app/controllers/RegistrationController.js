// "import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
  async store(req, res) {
    const { plan_id, student_id } = req.body;

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

    return res.json({ planExists, studentExists });
  }
}

export default new RegistrationController();
