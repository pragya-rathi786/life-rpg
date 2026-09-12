const User = require('../models/User');

// Fixed shop items (Credits cost)
const SHOP_ITEMS = [
  { id: 'title_rookie', name: 'Rookie Badge', emoji: '🥉', cost: 20 },
  { id: 'title_warrior', name: 'Warrior Title', emoji: '⚔️', cost: 50 },
  { id: 'title_legend', name: 'Legend Status', emoji: '🏆', cost: 100 },
  { id: 'title_cybergod', name: 'Cyber God', emoji: '👑', cost: 200 },
];

// GET all shop items
exports.getShopItems = (req, res) => {
  res.json({ items: SHOP_ITEMS });
};

// BUY an item
exports.buyItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const user = await User.findById(req.userId);

    // Check if already owned
    const alreadyOwned = user.inventory.some((inv) => inv.itemName === item.name);
    if (alreadyOwned) {
      return res.status(400).json({ message: 'Already owned' });
    }

    // Check if enough currency
    if (user.currency < item.cost) {
      return res.status(400).json({ message: 'Not enough credits' });
    }

    user.currency -= item.cost;
    user.inventory.push({ itemName: item.name });
    await user.save();

    res.json({ message: 'Item purchased!', updatedUser: user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};