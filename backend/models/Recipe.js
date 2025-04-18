const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: [String],
  steps: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true }, // Optional field for recipe image URL
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of user references
}, {
  timestamps: true,
  collection: 'recipe'  // ⚠️ force collection name to match what you have
});

module.exports = mongoose.model('Recipe', recipeSchema);
