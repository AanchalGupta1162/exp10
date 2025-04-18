import React, { useState, useEffect } from 'react';
import { Button, Modal, Spinner, Alert } from 'react-bootstrap';
import BasicExample from '../components/Card';
import '../styles/RecipePages.css';
import { useFavorites } from '../contexts/FavoritesContext';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToFavorites } = useFavorites();
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/recipes');
        if (!res.ok) throw new Error('Failed to fetch recipes');
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleViewRecipe = (id) => {
    const recipe = recipes.find(recipe => recipe._id === id);
    if (recipe) {
      setCurrentRecipe(recipe);
      setShowViewModal(true);
    }
  };

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
      <h1>All Recipes</h1>

      {loading && <Spinner animation="border" variant="primary" />}
      {error && <Alert variant="danger">Error: {error}</Alert>}

      <div className="recipe-grid">
        {recipes.map(recipe => (
          <div key={recipe._id} className="recipe-card">
            <BasicExample 
              id={recipe._id}
              title={recipe.title} 
              description={recipe.description} 
              image={recipe.imageUrl} 
              onViewRecipe={handleViewRecipe}
            />
          </div>
        ))}
      </div>

      {currentRecipe && (
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{currentRecipe.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="recipe-view">
              {currentRecipe.imageUrl && (
                <div className="recipe-image mb-4">
                  <img src={currentRecipe.imageUrl} alt={currentRecipe.title} className="img-fluid rounded" />
                </div>
              )}
              <div className="recipe-description mb-4">
                <h5>Description</h5>
                <p>{currentRecipe.description}</p>
              </div>
              <div className="recipe-ingredients mb-4">
                <h5>Ingredients</h5>
                {formatIngredients(currentRecipe.ingredients)}
              </div>
              <div className="recipe-instructions">
                <h5>Instructions</h5>
                <p style={{ whiteSpace: 'pre-line' }}>{Array.isArray(currentRecipe.steps) ? currentRecipe.steps.join('\n') : currentRecipe.steps}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="outline-danger" 
              className="me-auto"
              onClick={() => {
                addToFavorites({
                  id: currentRecipe._id,
                  title: currentRecipe.title,
                  description: currentRecipe.description,
                  image: currentRecipe.imageUrl,
                  ingredients: currentRecipe.ingredients,
                  instructions: currentRecipe.steps
                });
              }}
            >
              <i className="bi bi-heart me-2"></i> Add to Favorites
            </Button>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Recipes;
