const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  createRecipe,
  addFavorite,
  removeFavorite,
  getUserRecipes,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

// Public route to fetch all recipes
router.get('/', getAllRecipes);

// Protected route to create a recipe (requires auth)
router.post('/', protect, createRecipe);

// Protected routes for update and delete operations
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

// Public route to add/remove favorites (no auth)
router.post('/:id/favorite', addFavorite);
router.delete('/:id/favorite', removeFavorite);

// Protected route to get user-specific recipes (requires auth)
router.get('/user', protect, getUserRecipes);

module.exports = router;
