const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  createRecipe,
  addFavorite,
  removeFavorite
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

// Public route to fetch all recipes
router.get('/', getAllRecipes);

// Protected route to create a recipe (requires auth)
router.post('/', protect, createRecipe);

// Public route to add/remove favorites (no auth)
router.post('/:id/favorite', addFavorite);
router.delete('/:id/favorite', removeFavorite);

module.exports = router;
