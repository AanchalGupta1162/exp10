const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  createRecipe,
  addFavorite,
  removeFavorite
} = require('../controllers/recipeController');

// Public route to fetch all recipes
router.get('/', getAllRecipes);

// Public route to create a recipe (no auth)
router.post('/', createRecipe);

// Public route to add/remove favorites (no auth)
router.post('/:id/favorite', addFavorite);
router.delete('/:id/favorite', removeFavorite);

module.exports = router;
