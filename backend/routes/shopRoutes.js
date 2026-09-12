const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getShopItems, buyItem } = require('../controllers/shopController');

router.use(authMiddleware);

router.get('/items', getShopItems);
router.post('/buy', buyItem);

module.exports = router;