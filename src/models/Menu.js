import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Appetizers', 'Main Course', 'Desserts', 'Beverages']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  availability: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Menu', menuSchema);