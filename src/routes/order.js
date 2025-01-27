import express from 'express';
import { body } from 'express-validator';
import Order from '../models/Order.js';
import Menu from '../models/Menu.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// order
router.post('/order',
  auth,
  [
    body('items').isArray().notEmpty(),
    body('items.*.menuItem').isMongoId(),
    body('items.*.quantity').isInt({ min: 1 })
  ],
  async (req, res, next) => {
    try {
      const { items } = req.body;
      
      
      let totalAmount = 0;
      for (const item of items) {
        const menuItem = await Menu.findById(item.menuItem);
        if (!menuItem || !menuItem.availability) {
          return res.status(400).json({
            message: `Menu item ${item.menuItem} is not available`
          });
        }
        totalAmount += menuItem.price * item.quantity;
      }

      const order = new Order({
        userId: req.user.userId,
        items,
        totalAmount
      });

      await order.save();
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }
);

//get all orders
router.get('/orders',
  auth,
  async (req, res, next) => {
    try {
      const orders = await Order.find({ userId: req.user.userId })
        .populate('items.menuItem')
        .sort('-createdAt');
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

export default router;