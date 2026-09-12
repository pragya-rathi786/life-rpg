const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
  currency: {
    type: Number,
    default: 0,
  },
  attributes: {
    intellect: { type: Number, default: 0 },
    strength: { type: Number, default: 0 },
    discipline: { type: Number, default: 0 },
  },
  streak: {
    count: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
  },
  inventory: [{
    itemName: String,
    purchasedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);