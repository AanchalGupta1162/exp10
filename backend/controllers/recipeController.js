const Recipe = require('../models/Recipe');

exports.getAllRecipes = async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
};

exports.createRecipe = async (req, res) => {
  const { title, description, ingredients, steps, imageUrl } = req.body; // Include imageUrl
  console.log("Creating Recipe:", req.body);  // 🐞 Debug line
  try {
    const recipe = await Recipe.create({ 
      title, 
      description, 
      ingredients, 
      steps, 
      imageUrl, // Add imageUrl to the recipe
      user: req.user._id // Associate recipe with the logged-in user
    });
    res.status(201).json(recipe);
  } catch (err) {
    console.error("Error creating recipe:", err);  // 🐞 Debug line
    res.status(400).json({ error: err.message });
  }
};

// Add a recipe to favorites
exports.addFavorite = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (!recipe.favorites.includes(req.user.id)) {
      recipe.favorites.push(req.user.id);
      await recipe.save();
    }

    res.status(200).json({ message: 'Recipe added to favorites', recipe });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove a recipe from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    recipe.favorites = recipe.favorites.filter(userId => userId.toString() !== req.user.id);
    await recipe.save();

    res.status(200).json({ message: 'Recipe removed from favorites', recipe });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

