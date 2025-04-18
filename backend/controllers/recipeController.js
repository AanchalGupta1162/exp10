const Recipe = require('../models/Recipe');

exports.getAllRecipes = async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
};

exports.getUserRecipes = async (req, res) => {
  // First check if user exists
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const recipes = await Recipe.find({ user: req.user.id });

  if (!recipes) {
    return res.status(404).json({ error: "No recipes found for this user" });
  }
  res.json(recipes);
};


exports.createRecipe = async (req, res) => {
  // First check if user exists
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { title, description, ingredients, steps, imageUrl } = req.body;
  
  try {
    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      steps,
      imageUrl,
      user: req.user.id,  // Updated to use `id` instead of `_id`
      favorites: []
    });
    
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const userId = req.body.userId; // Simulate a user ID
    if (!recipe.favorites.includes(userId)) {
      recipe.favorites.push(userId);
      await recipe.save();
    }

    res.status(200).json({ message: 'Recipe added to favorites', recipe });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const userId = req.body.userId;
    recipe.favorites = recipe.favorites.filter(id => id.toString() !== userId);
    await recipe.save();

    res.status(200).json({ message: 'Recipe removed from favorites', recipe });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
