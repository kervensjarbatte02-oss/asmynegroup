const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { authMiddleware } = require('../utils/auth');
const router = express.Router();

// Créer une commande
router.post('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Panier vide.' });
    const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const order = await Order.create({ user: req.userId, items: cart.items, total });
    cart.items = [];
    await cart.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: 'Erreur commande.' });
  }
});

// Voir les commandes
router.get('/', authMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.userId }).populate('items.product');
  res.json(orders);
});

module.exports = router;
