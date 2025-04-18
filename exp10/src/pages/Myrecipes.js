import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import BasicExample from '../components/Card';
import '../styles/RecipePages.css';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

function Myrecipes() {
  const [recipes, setRecipes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({ title: '', description: '', image: '', ingredients: [], instructions: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { user } = useAuth();

  // 🧠 Fetch recipes on mount
  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5000/api/recipes/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include' // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch user recipes');
        }

        const data = await response.json();
        setRecipes(data);
        console.log('Fetched user recipes:', data);
      } catch (err) {
        console.error('Error fetching user recipes:', err.message);
        setError('Failed to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) { // Only fetch recipes if user is logged in
      fetchUserRecipes();
    }
  }, [user]);

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRecipe({ ...currentRecipe, [name]: value });
  };

  // CRUD Operations
  // Create
  const handleAddRecipe = async () => {
    try {
      // Format recipe data for API
      const recipeData = {
        title: currentRecipe.title,
        description: currentRecipe.description,
        imageUrl: currentRecipe.image,
        ingredients: currentRecipe.ingredients || [],
        steps: currentRecipe.instructions || ''
      };
      
      // Send recipe to backend
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(recipeData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create recipe');
      }
      
      // Get the newly created recipe from the response
      const newRecipe = await response.json();
      console.log('Created new recipe:', newRecipe);
      
      // Update local state
      setRecipes([...recipes, newRecipe]);
      
      // Reset form and close modal
      setCurrentRecipe({ title: '', description: '', image: '', ingredients: [], instructions: '' });
      setShowAddModal(false);
      
    } catch (err) {
      console.error('Error creating recipe:', err.message);
      alert('Failed to create recipe. Please try again.');
    }
  };

  // Read - already implemented with the mapping in the JSX
  const handleViewRecipe = (id) => {
    const recipe = recipes.find(recipe => recipe._id === id);
    if (recipe) {
      // Convert backend format to frontend format
      const formattedRecipe = {
        id: recipe._id,
        title: recipe.title,
        description: recipe.description,
        image: recipe.imageUrl,
        ingredients: recipe.ingredients,
        instructions: recipe.steps
      };
      setCurrentRecipe(formattedRecipe);
      setShowViewModal(true);
    }
  };

  // Update
  const handleEditClick = (recipe) => {
    // Convert backend format to frontend format
    const formattedRecipe = {
      id: recipe._id,
      title: recipe.title,
      description: recipe.description,
      image: recipe.imageUrl,
      ingredients: recipe.ingredients,
      instructions: recipe.steps
    };
    setCurrentRecipe(formattedRecipe);
    setShowEditModal(true);
  };

  const handleUpdateRecipe = async () => {
    try {
      // Format recipe data for API
      const recipeData = {
        title: currentRecipe.title,
        description: currentRecipe.description,
        imageUrl: currentRecipe.image,
        ingredients: currentRecipe.ingredients,
        steps: currentRecipe.instructions
      };
      
      // Send update to backend
      const response = await fetch(`http://localhost:5000/api/recipes/${currentRecipe.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(recipeData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update recipe');
      }
      
      const updatedRecipe = await response.json();
      
      // Update local state
      setRecipes(recipes.map(recipe => 
        recipe._id === currentRecipe.id ? updatedRecipe : recipe
      ));
      setShowEditModal(false);
      
    } catch (err) {
      console.error('Error updating recipe:', err.message);
      alert('Failed to update recipe. Please try again.');
    }
  };

  // Delete
  const handleDeleteClick = (recipe) => {
    // Convert backend format to frontend format
    const formattedRecipe = {
      id: recipe._id,
      title: recipe.title
    };
    setCurrentRecipe(formattedRecipe);
    setShowDeleteModal(true);
  };

  const handleDeleteRecipe = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${currentRecipe.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete recipe');
      }
      
      // Update local state
      setRecipes(recipes.filter(recipe => recipe._id !== currentRecipe.id));
      setShowDeleteModal(false);
      
    } catch (err) {
      console.error('Error deleting recipe:', err.message);
      alert('Failed to delete recipe. Please try again.');
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

  // Handle favorite toggle in modal
  const handleToggleFavorite = () => {
    if (isFavorite(currentRecipe.id)) {
      removeFromFavorites(currentRecipe.id);
    } else {
      addToFavorites({
        id: currentRecipe.id,
        title: currentRecipe.title,
        description: currentRecipe.description,
        image: currentRecipe.image,
        ingredients: currentRecipe.ingredients,
        instructions: currentRecipe.instructions
      });
    }
  };

  return (
    <div className="recipe-container">
      <div className="recipes-header">
        <h1>My Recipes</h1>
        <Button 
          variant="success" 
          onClick={() => {
            setCurrentRecipe({ title: '', description: '', image: '', ingredients: [], instructions: '' });
            setShowAddModal(true);
          }}
        >
          Add New Recipe
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <p>Loading your recipes...</p>
        </div>
      ) : error ? (
        <div className="text-center my-5 text-danger">
          <p>{error}</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center my-5">
          <p>You don't have any recipes yet. Click "Add New Recipe" to create one!</p>
        </div>
      ) : (
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
              <div className="recipe-actions">
                <Button variant="info" size="sm" onClick={() => handleEditClick(recipe)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(recipe)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Recipe Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                name="title"
                value={currentRecipe.title} 
                onChange={handleInputChange} 
                placeholder="Recipe title" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                name="description"
                value={currentRecipe.description} 
                onChange={handleInputChange} 
                placeholder="Recipe description" 
                rows={3} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control 
                type="text" 
                name="image"
                value={currentRecipe.image} 
                onChange={handleInputChange} 
                placeholder="https://example.com/image.jpg" 
              />
              <Form.Text className="text-muted">
                Enter a URL for the recipe image
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control 
                as="textarea" 
                name="ingredients"
                value={Array.isArray(currentRecipe.ingredients) ? currentRecipe.ingredients.join('\n') : currentRecipe.ingredients} 
                onChange={(e) => setCurrentRecipe({...currentRecipe, ingredients: e.target.value.split('\n')})} 
                placeholder="Enter ingredients (one per line)" 
                rows={4} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control 
                as="textarea" 
                name="instructions"
                value={currentRecipe.instructions} 
                onChange={handleInputChange} 
                placeholder="Enter cooking instructions" 
                rows={4} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddRecipe}>Add Recipe</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Recipe Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                name="title"
                value={currentRecipe.title} 
                onChange={handleInputChange} 
                placeholder="Recipe title" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                name="description"
                value={currentRecipe.description} 
                onChange={handleInputChange} 
                placeholder="Recipe description" 
                rows={3} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control 
                type="text" 
                name="image"
                value={currentRecipe.image} 
                onChange={handleInputChange} 
                placeholder="https://example.com/image.jpg" 
              />
              <Form.Text className="text-muted">
                Enter a URL for the recipe image
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control 
                as="textarea" 
                name="ingredients"
                value={Array.isArray(currentRecipe.ingredients) ? currentRecipe.ingredients.join('\n') : currentRecipe.ingredients} 
                onChange={(e) => setCurrentRecipe({...currentRecipe, ingredients: e.target.value.split('\n')})} 
                placeholder="Enter ingredients (one per line)" 
                rows={4} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control 
                as="textarea" 
                name="instructions"
                value={currentRecipe.instructions} 
                onChange={handleInputChange} 
                placeholder="Enter cooking instructions" 
                rows={4} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateRecipe}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Recipe Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{currentRecipe.title}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteRecipe}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* View Recipe Modal */}
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
            <div className="recipe-ingredients mb-4">
              <h5>Ingredients</h5>
              {formatIngredients(currentRecipe.ingredients)}
            </div>
            <div className="recipe-instructions">
              <h5>Instructions</h5>
              <p style={{ whiteSpace: 'pre-line' }}>{currentRecipe.instructions}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant={isFavorite(currentRecipe.id) ? "danger" : "outline-danger"} 
            className="me-auto"
            onClick={handleToggleFavorite}
          >
            <i className={`bi ${isFavorite(currentRecipe.id) ? "bi-heart-fill" : "bi-heart"} me-2`}></i>
            {isFavorite(currentRecipe.id) ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Myrecipes;