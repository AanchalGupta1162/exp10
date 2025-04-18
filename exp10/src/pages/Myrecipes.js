import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import BasicExample from '../components/Card';
import '../styles/RecipePages.css';
import { useFavorites } from '../contexts/FavoritesContext';

function Myrecipes() {
  // Initial recipes data
  const initialRecipes = [
    { 
      id: 1, 
      title: 'Homemade Pizza', 
      description: 'My special pizza recipe with homemade dough and fresh toppings.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=60',
      ingredients: ['2 cups flour', '1 cup warm water', '2 tbsp olive oil', '1 tsp salt', '1 tsp yeast', 'Your favorite toppings'],
      instructions: '1. Mix flour, water, oil, salt, and yeast in a bowl.\n2. Knead for 10 minutes until smooth.\n3. Let rise for 1 hour.\n4. Stretch dough and add toppings.\n5. Bake at 475°F for 12-15 minutes.'
    },
    { 
      id: 2, 
      title: 'Blueberry Muffins', 
      description: 'Sweet and fluffy blueberry muffins perfect for breakfast.',
      image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=500&q=60',
      ingredients: ['2 cups flour', '1 cup sugar', '2 tsp baking powder', '1/2 tsp salt', '1/2 cup butter', '2 eggs', '1 cup milk', '2 cups blueberries'],
      instructions: '1. Preheat oven to 375°F.\n2. Mix dry ingredients in one bowl.\n3. Cream butter and sugar, add eggs and milk.\n4. Combine with dry ingredients and fold in blueberries.\n5. Fill muffin cups 2/3 full.\n6. Bake for 20-25 minutes.'
    },
    { 
      id: 3, 
      title: 'Grilled Salmon', 
      description: 'Healthy grilled salmon with lemon and herbs.',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=60',
      ingredients: ['4 salmon fillets', '2 tbsp olive oil', '2 cloves garlic, minced', '1 lemon, juiced', '1 tbsp fresh dill', 'Salt and pepper to taste'],
      instructions: '1. Mix olive oil, garlic, lemon juice, and dill in a bowl.\n2. Season salmon with salt and pepper.\n3. Brush salmon with marinade.\n4. Grill for 4-5 minutes per side.\n5. Serve with lemon wedges.'
    },
    { 
      id: 4, 
      title: 'Mushroom Risotto', 
      description: 'Creamy risotto with sautéed mushrooms and parmesan.',
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=500&q=60',
      ingredients: ['1 cup arborio rice', '4 cups vegetable broth', '1/2 cup white wine', '1 onion, diced', '2 cups mushrooms, sliced', '2 tbsp butter', '1/2 cup parmesan cheese', 'Salt and pepper to taste'],
      instructions: '1. Sauté onion in butter until translucent.\n2. Add mushrooms and cook until soft.\n3. Add rice and toast for 2 minutes.\n4. Add wine and stir until absorbed.\n5. Add broth 1/2 cup at a time, stirring frequently.\n6. Once rice is creamy and cooked, stir in parmesan.\n7. Season with salt and pepper.'
    }
  ];

  // States
  const [recipes, setRecipes] = useState(initialRecipes);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({ id: null, title: '', description: '', image: '', ingredients: [], instructions: '' });

  // Use favorites context
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRecipe({ ...currentRecipe, [name]: value });
  };

  // CRUD Operations
  // Create
  const handleAddRecipe = () => {
    const newRecipe = {
      ...currentRecipe,
      id: recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1,
      ingredients: currentRecipe.ingredients || [],
      instructions: currentRecipe.instructions || ''
    };
    
    setRecipes([...recipes, newRecipe]);
    setCurrentRecipe({ id: null, title: '', description: '', image: '', ingredients: [], instructions: '' });
    setShowAddModal(false);
  };

  // Read - already implemented with the mapping in the JSX
  const handleViewRecipe = (id) => {
    const recipe = recipes.find(recipe => recipe.id === id);
    if (recipe) {
      setCurrentRecipe(recipe);
      setShowViewModal(true);
    }
  };

  // Update
  const handleEditClick = (recipe) => {
    setCurrentRecipe(recipe);
    setShowEditModal(true);
  };

  const handleUpdateRecipe = () => {
    setRecipes(recipes.map(recipe => 
      recipe.id === currentRecipe.id ? currentRecipe : recipe
    ));
    setShowEditModal(false);
  };

  // Delete
  const handleDeleteClick = (recipe) => {
    setCurrentRecipe(recipe);
    setShowDeleteModal(true);
  };

  const handleDeleteRecipe = () => {
    setRecipes(recipes.filter(recipe => recipe.id !== currentRecipe.id));
    setShowDeleteModal(false);
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
            setCurrentRecipe({ id: null, title: '', description: '', image: '', ingredients: [], instructions: '' });
            setShowAddModal(true);
          }}
        >
          Add New Recipe
        </Button>
      </div>

      <div className="recipe-grid">
        {recipes.map(recipe => (
          <div key={recipe.id} className="recipe-card">
            <BasicExample 
              id={recipe.id}
              title={recipe.title} 
              description={recipe.description} 
              image={recipe.image}
              onViewRecipe={handleViewRecipe}
            />
            <div className="recipe-actions">
              <Button variant="info" size="sm" onClick={() => handleEditClick(recipe)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => handleDeleteClick(recipe)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

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