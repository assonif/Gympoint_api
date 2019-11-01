import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const e = await Student.create(req.body);

    return res.json(e);
  }

  get(req, res) {
    res.json({ message: 'show' });
  }
}

export default new StudentController();
