import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      weight: Yup.string().required(),
      height: Yup.string().required(),
      age: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const { id, name, email, age, height, weight } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      height,
      weight,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      weight: Yup.string(),
      height: Yup.string(),
      age: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const { email } = req.body;

    if (email && email !== student.email) {
      const studentExists = await Student.findOne({
        where: { email: req.body.email },
      });

      if (studentExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    const { id, name, age, height, weight } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      height,
      weight,
    });
  }
}

export default new StudentController();
