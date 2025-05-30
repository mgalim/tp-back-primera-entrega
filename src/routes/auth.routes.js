import { Router } from 'express';
import { User } from '../models/user.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { userSchema } from '../validations/schemas.js';
import { hashPassword, comparePassword } from '../utils/passwordHashed.js';
import { generateToken } from '../utils/jwtUtils.js';

const router = Router();

router.post('/register', validateSchema(userSchema), async (req, res) => {
  const { name, lastname, email, password, role } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    lastname,
    email,
    password: hashedPassword,
    role,
  });
  res.status(201).json(user);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken({ id: user._id });
  res.json({ token });
});

export default router;
