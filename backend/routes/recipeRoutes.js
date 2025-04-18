const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { addFavorite, removeFavorite } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.get('/', recipeController.getAllRecipes);

// Admin-only route
router.post('/', recipeController.createRecipe);

router.post('/:id/favorite', protect, addFavorite);
router.delete('/:id/favorite', protect, removeFavorite);

module.exports = router;
