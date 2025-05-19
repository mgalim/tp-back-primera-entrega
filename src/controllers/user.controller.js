import { User } from '../models/user.js';
import BaseController from './base.controller.js';

class UserController extends BaseController {
  constructor() {
    super(User);
  }

  async getByRole(req, res) {
    try {
      const { role } = req.params;
      const users = await this.model.find({ role });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['administrador', 'empleado', 'supervisor'].includes(role)) {
        return res.status(400).json({ message: 'Rol inválido' });
      }

      const user = await this.model.findByIdAndUpdate(id, { role }, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new UserController();
