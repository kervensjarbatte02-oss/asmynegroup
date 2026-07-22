const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authMiddleware } = require('../utils/auth');
const router = express.Router();

// Ajouter au panier
router.post('/', authMiddleware, async (req, res) => {
  let { productId, quantity } = req.body;
  try {
    // Si productId n'est pas un ObjectId, on suppose que c'est un slug
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      const prod = await Product.findOne({ slug: productId });
      if (!prod) return res.status(400).json({ error: "Produit introuvable." });
      productId = prod._id;
    }
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) cart = await Cart.create({ user: req.userId, items: [] });
    const prodIdx = cart.items.findIndex(i => i.product.toString() === productId.toString());
    if (prodIdx > -1) {
      cart.items[prodIdx].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (e) {
    res.status(500).json({ error: 'Erreur panier.' });
  }
});

// Voir le panier
router.get('/', authMiddleware, async (req, res) => {
  const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
  res.json(cart || { items: [] });
});

module.exports = router;
