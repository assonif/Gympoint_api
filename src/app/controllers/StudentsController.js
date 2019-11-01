import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const { id, nome, email, idade, altura, peso } = await Student.create(
      req.body
    );

    return res.json({
      id,
      nome,
      email,
      idade,
      altura,
      peso,
    });
  }

  async update(req, res) {
    const studentExists = await Student.findByPk(req.params.id);

    if (!studentExists) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const { id, nome, email, idade, altura, peso } = await studentExists.update(
      req.body
    );

    return res.json({
      id,
      nome,
      email,
      idade,
      altura,
      peso,
    });
  }
}

export default new StudentController();
