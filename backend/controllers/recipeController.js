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

exports.updateRecipe = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const { id } = req.params;
    const { title, description, ingredients, steps, imageUrl } = req.body;
    
    // Find the recipe and verify ownership
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Verify that the user owns this recipe
    if (recipe.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }
    
    // Update the recipe
    recipe.title = title;
    recipe.description = description;
    recipe.ingredients = ingredients;
    recipe.steps = steps;
    recipe.imageUrl = imageUrl;
    
    await recipe.save();
    
    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const { id } = req.params;
    
    // Find the recipe and verify ownership
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Verify that the user owns this recipe
    if (recipe.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }
    
    // Delete the recipe
    await Recipe.findByIdAndDelete(id);
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
