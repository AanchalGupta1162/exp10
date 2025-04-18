const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  createRecipe,
  addFavorite,
  removeFavorite,
  getUserRecipes
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

// Public route to fetch all recipes
router.get('/', getAllRecipes);

// Protected route to create a recipe (requires auth)
router.post('/', protect, createRecipe);

// Public route to add/remove favorites (no auth)
router.post('/:id/favorite', addFavorite);
router.delete('/:id/favorite', removeFavorite);

// Protected route to get user-specific recipes (requires auth)
router.get('/user', protect, getUserRecipes);

module.exports = router;
