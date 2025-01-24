import express from 'express';
import { body, param } from 'express-validator';
import Menu from '../models/Menu.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.get('/menu', async (req, res, next) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (error) {
    next(error);
  }
});


router.post('/menu',
  auth,
  [
    body('name').trim().notEmpty(),
    body('category').isIn(['Appetizers', 'Main Course', 'Desserts', 'Beverages']),
    body('price').isFloat({ min: 0 }),
    body('availability').optional().isBoolean()
  ],
  async (req, res, next) => {
    try {
      const menuItem = new Menu(req.body);
      await menuItem.save();
      res.status(201).json(menuItem);
    } catch (error) {
      next(error);
    }
  }
);


router.put('/menu/:id',
  auth,
  [
    param('id').isMongoId(),
    body('name').optional().trim().notEmpty(),
    body('category').optional().isIn(['Appetizers', 'Main Course', 'Desserts', 'Beverages']),
    body('price').optional().isFloat({ min: 0 }),
    body('availability').optional().isBoolean()
  ],
  async (req, res, next) => {
    try {
      const menuItem = await Menu.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
      res.json(menuItem);
    } catch (error) {
      next(error);
    }
  }
);


router.delete('/menu/:id',
  auth,
  [param('id').isMongoId()],
  async (req, res, next) => {
    try {
      const menuItem = await Menu.findByIdAndDelete(req.params.id);
      if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
      res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;