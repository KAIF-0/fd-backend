import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.post('/register',
  [
    body('username').trim().isLength({ min: 3 }).escape(),
    body('password').isLength({ min: 6 })
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
      const user = new User({ username, password });
      await user.save();    //save user

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({ user: { id: user._id, username: user.username }, token });   //token saved in cookies
    } catch (error) {
      next(error);
    }
  }
);


router.post('/login',
  [
    body('username').trim().escape(),
    body('password').exists()
  ],
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({ user: { id: user._id, username: user.username }, token });   //token saved in cookies
    } catch (error) {
      next(error);
    }
  }
);

export default router;