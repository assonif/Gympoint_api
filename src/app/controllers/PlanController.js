import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.string().required(),
      duration: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, duration, price } = req.body;

    const plan = await Plan.create({
      title,
      duration,
      price,
    });

    return res.json(plan);
  }

  async index(req, res) {
    const plan = await Plan.findAll({
      attributes: ['title', 'duration', 'price'],
    });

    if (plan.length === 0) {
      return res.status(400).json({ error: 'No plans found' });
    }

    return res.json(plan);
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'This plan does not exists' });
    }

    await plan.destroy().then(deletedPet => {
      return res.json(deletedPet);
    });

    return res.status(400).json({ error: 'You cannot delete this plan' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      price: Yup.string(),
      duration: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'This plan does not exists' });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }
}

export default new PlanController();
