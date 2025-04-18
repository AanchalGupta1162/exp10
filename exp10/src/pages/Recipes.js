import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import BasicExample from '../components/Card';
import '../styles/RecipePages.css';
import { useFavorites } from '../contexts/FavoritesContext';

function Recipes() {
  // Sample recipe data with image URLs
  const recipes = [
    { 
      id: 1, 
      title: 'Spaghetti Carbonara', 
      description: 'Classic Italian pasta dish with eggs, cheese, pancetta and black pepper.',
      image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?auto=format&fit=crop&w=500&q=60',
      ingredients: ['350g spaghetti', '150g pancetta', '2 large eggs', '50g pecorino cheese', '50g parmesan', '2 cloves garlic', 'Salt and black pepper'],
      instructions: '1. Cook spaghetti according to package instructions.\n2. Fry pancetta with garlic until crispy.\n3. Whisk eggs and cheese in a bowl.\n4. Drain pasta and add to pancetta while still hot.\n5. Remove from heat and quickly stir in egg mixture.\n6. Season with pepper and serve immediately.'
    },
    { 
      id: 2, 
      title: 'Chicken Curry', 
      description: 'Delicious chicken curry with aromatic spices and creamy sauce.',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60',
      ingredients: ['500g chicken breast', '1 onion', '2 tbsp curry powder', '400ml coconut milk', '2 tbsp vegetable oil', '2 cloves garlic', '1 tbsp ginger', 'Salt to taste'],
      instructions: '1. Heat oil and sauté onions until translucent.\n2. Add garlic and ginger, cook for 1 minute.\n3. Add curry powder and stir for 30 seconds.\n4. Add chicken and cook until sealed.\n5. Pour in coconut milk and simmer for 15-20 minutes.\n6. Season to taste and serve with rice.'
    },
    { 
      id: 3, 
      title: 'Veggie Stir Fry', 
      description: 'Quick and healthy vegetable stir fry with soy sauce and ginger.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60',
      ingredients: ['1 bell pepper', '1 carrot', '1 broccoli head', '100g snap peas', '2 tbsp soy sauce', '1 tbsp sesame oil', '1 tbsp ginger', '2 cloves garlic'],
      instructions: '1. Chop all vegetables into bite-sized pieces.\n2. Heat sesame oil in a wok or large pan.\n3. Add garlic and ginger, stir for 30 seconds.\n4. Add vegetables and stir fry for 5-7 minutes.\n5. Add soy sauce and continue cooking for 2 minutes.\n6. Serve hot, optionally with rice or noodles.'
    },
    { 
      id: 4, 
      title: 'Chocolate Cake', 
      description: 'Rich and moist chocolate cake with chocolate ganache.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60',
      ingredients: ['200g flour', '250g sugar', '75g cocoa powder', '1.5 tsp baking powder', '1.5 tsp baking soda', '2 eggs', '250ml milk', '125ml vegetable oil', '2 tsp vanilla extract', '250ml boiling water', '200g chocolate for ganache', '100ml heavy cream'],
      instructions: '1. Preheat oven to 180°C and grease two 9-inch cake pans.\n2. Mix dry ingredients in a bowl.\n3. Add eggs, milk, oil, and vanilla; beat for 2 minutes.\n4. Stir in boiling water (batter will be thin).\n5. Pour into pans and bake for 30-35 minutes.\n6. For ganache, heat cream and pour over chocolate pieces. Stir until smooth.\n7. Cool cake completely before frosting with ganache.'
    },
    { 
      id: 5, 
      title: 'Greek Salad', 
      description: 'Fresh Mediterranean salad with feta cheese, olives, and olive oil.',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=500&q=60',
      ingredients: ['1 cucumber', '4 tomatoes', '1 red onion', '200g feta cheese', '100g kalamata olives', '2 tbsp olive oil', '1 tbsp red wine vinegar', 'Dried oregano', 'Salt and pepper'],
      instructions: '1. Dice cucumber and tomatoes into chunks.\n2. Slice red onion thinly.\n3. Combine vegetables in a bowl.\n4. Add crumbled feta cheese and olives.\n5. Whisk olive oil and vinegar with oregano, salt, and pepper.\n6. Drizzle dressing over salad and toss gently.\n7. Serve immediately or refrigerate for up to 2 hours.'
    },
    { 
      id: 6, 
      title: 'Vegetable Tacos', 
      description: 'Flavorful vegetable tacos with fresh toppings and homemade salsa.',
      image: 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?auto=format&fit=crop&w=500&q=60',
      ingredients: ['8 corn tortillas', '2 bell peppers', '1 zucchini', '1 onion', '2 garlic cloves', '1 tbsp cumin', '1 tbsp chili powder', '1 avocado', 'Fresh cilantro', 'Lime wedges', '2 tomatoes for salsa', '1 jalapeño for salsa'],
      instructions: '1. Slice vegetables into strips.\n2. Sauté onions and garlic until soft.\n3. Add peppers and zucchini, cook until tender-crisp.\n4. Season with cumin, chili powder, salt, and pepper.\n5. For salsa, dice tomatoes and jalapeño, mix with lime juice and cilantro.\n6. Warm tortillas in a dry pan.\n7. Fill tortillas with vegetable mixture.\n8. Top with salsa, sliced avocado, and cilantro.\n9. Serve with lime wedges.'
    }
  ];

  // Use favorites context
  const { addToFavorites } = useFavorites();

  // State for view modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);

  // Handle view recipe
  const handleViewRecipe = (id) => {
    const recipe = recipes.find(recipe => recipe.id === id);
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
      <h1>All Recipes</h1>
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
          </div>
        ))}
      </div>

      {/* View Recipe Modal */}
      {currentRecipe && (
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {currentRecipe.title}
            </Modal.Title>
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
              variant="outline-danger" 
              className="me-auto"
              onClick={() => {
                addToFavorites({
                  id: currentRecipe.id,
                  title: currentRecipe.title,
                  description: currentRecipe.description,
                  image: currentRecipe.image,
                  ingredients: currentRecipe.ingredients,
                  instructions: currentRecipe.instructions
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