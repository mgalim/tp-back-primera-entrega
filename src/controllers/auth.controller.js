import { User } from '../models/user.js';

import { comparePassword } from '../utils/passwordHashed.js';
import { generateToken } from '../utils/jwtUtils.js';
class AuthController {
  constructor() {
    this.model = User;
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.model.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = generateToken({ id: user._id });

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.json({ success: true, user });
    } catch (error) {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  }
}

export default new AuthController();
