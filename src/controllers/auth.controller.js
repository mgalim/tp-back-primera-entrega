import { User } from '../models/user.js';

import { comparePassword } from '../utils/passwordHashed.js';
import { generateToken } from '../utils/jwtUtils.js';
class AuthController {
  constructor() {
    this.model = User;
  }

  async login(req, res) {
    const { email, password } = req.body;
    const user = await this.model.findOne({ email });
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken({ id: user._id });
    res.json({ token });
  }
}

export default new AuthController();
