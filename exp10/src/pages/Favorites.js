import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import BasicExample from '../components/Card';
import '../styles/RecipePages.css';
import { useFavorites } from '../contexts/FavoritesContext';

function Favorites() {
  // Get favorites from context
  const { favorites } = useFavorites();

  // State for view modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);

  // Handle view recipe
  const handleViewRecipe = (id) => {
    const recipe = favorites.find(recipe => recipe.id === id);
    if (recipe) {
      setCurrentRecipe(recipe);
      setShowViewModal(true);
    }
  };

  // Helper to format ingredients as a list if it's an array
  const formatIngredients = (ingredients) => {
    if (Array.isArray(ingredients)) {
      return (
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      );
    }
    return <p>{ingredients}</p>;
  };

  return (
    <div className="recipe-container">
      <h1>Favorite Recipes</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center my-5">
          <h3>You haven't added any favorites yet</h3>
          <p className="text-muted">Click the heart icon on any recipe to add it to your favorites.</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {favorites.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <BasicExample 
                id={recipe.id}
                title={recipe.title} 
                description={recipe.description} 
                image={recipe.image}
                onViewRecipe={handleViewRecipe}
                // Show the heart but on favorites page we might want to have a different behavior
                showFavoriteButton={true}
              />
            </div>
          ))}
        </div>
      )}

      {/* View Recipe Modal */}
      {currentRecipe && (
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{currentRecipe.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="recipe-view">
              {currentRecipe.image && (
                <div className="recipe-image mb-4">
                  <img src={currentRecipe.image} alt={currentRecipe.title} className="img-fluid rounded" />
                </div>
              )}
              <div className="recipe-description mb-4">
                <h5>Description</h5>
                <p>{currentRecipe.description}</p>
              </div>
              {currentRecipe.ingredients && (
                <div className="recipe-ingredients mb-4">
                  <h5>Ingredients</h5>
                  {formatIngredients(currentRecipe.ingredients)}
                </div>
              )}
              {currentRecipe.instructions && (
                <div className="recipe-instructions">
                  <h5>Instructions</h5>
                  <p style={{ whiteSpace: 'pre-line' }}>{currentRecipe.instructions}</p>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Favorites;