import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const FavoritesContext = createContext();

// Custom hook for using the favorites context
export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  // Load favorites from localStorage on initial render
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Update localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Add recipe to favorites
  const addToFavorites = (recipe) => {
    // Check if recipe is already in favorites
    if (!favorites.some(fav => fav.id === recipe.id)) {
      setFavorites([...favorites, recipe]);
    }
  };

  // Remove recipe from favorites
  const removeFromFavorites = (recipeId) => {
    setFavorites(favorites.filter(recipe => recipe.id !== recipeId));
  };

  // Check if recipe is in favorites
  const isFavorite = (recipeId) => {
    return favorites.some(recipe => recipe.id === recipeId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};