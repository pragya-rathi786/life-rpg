const Task = require('../models/Task');
const User = require('../models/User');
const XP_MAP = {
  easy: 15,
  medium: 30,
  hard: 60,
};

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, category, difficulty } = req.body;

    const xpReward = XP_MAP[difficulty] || XP_MAP.easy;

    const newTask = new Task({
      userId: req.userId,
      title,
      description,
      category,
      xpReward,
    });

    await newTask.save();
    res.status(201).json({ message: 'Quest created', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL TASKS (sirf logged-in user ke)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE TASK (edit title/description/category)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    Object.assign(task, req.body);
    await task.save();

    res.json({ message: 'Quest updated', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    res.json({ message: 'Quest deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// COMPLETE TASK (yahan XP/Level logic aayega — abhi basic rakhte hai)
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    if (task.completed) {
      return res.status(400).json({ message: 'Quest already completed' });
    }

    task.completed = true;
    task.completedAt = new Date();
    await task.save();

    // User ko XP dena (agle step mein hum leveling logic add karenge)
        const user = await User.findById(req.userId);
    user.xp += task.xpReward;
    user.attributes[task.category] += 1;

    let leveledUp = false;
    let xpNeeded = user.level * 100;

    while (user.xp >= xpNeeded) {
      user.xp -= xpNeeded;
      user.level += 1;
      user.currency += 20;
      leveledUp = true;
      xpNeeded = user.level * 100;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.streak.lastActiveDate) {
      const lastActive = new Date(user.streak.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak.count += 1;
      } else if (diffDays > 1) {
        user.streak.count = 1;
      }
    } else {
      user.streak.count = 1;
    }
    user.streak.lastActiveDate = today;

    await user.save();

    res.json({
      message: leveledUp ? 'Quest completed! Level Up! 🎉' : 'Quest completed! XP earned',
      task,
      updatedUser: user,
      leveledUp,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};