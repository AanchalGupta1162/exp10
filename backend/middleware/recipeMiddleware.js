const validateRecipe = (req, res, next) => {
  const { title, description, ingredients, steps } = req.body;

  if (!title || !description || !ingredients || !steps) {
    return res.status(400).json({ error: "All required fields (title, description, ingredients, steps) must be provided." });
  }

  if (!Array.isArray(ingredients) || !Array.isArray(steps)) {
    return res.status(400).json({ error: "Ingredients and steps must be arrays." });
  }

  next();
};

module.exports = { validateRecipe };
