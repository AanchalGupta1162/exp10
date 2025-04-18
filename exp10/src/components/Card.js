import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useFavorites } from '../contexts/FavoritesContext';

function BasicExample({ id, title, description, image, onViewRecipe, showFavoriteButton = true }) {
  // Default placeholder image if none provided
  const imageUrl = image || 'https://via.placeholder.com/300x180?text=Recipe+Image';
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  
  // Check if this recipe is a favorite
  const favorite = isFavorite(id);
  
  // Toggle favorite status
  const handleFavoriteToggle = (e) => {
    e.stopPropagation(); // Prevent triggering the view recipe function
    
    if (favorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites({ id, title, description, image });
    }
  };
  
  return (
    <Card className="h-100">
      <div className="position-relative">
        <Card.Img variant="top" src={imageUrl} alt={title} />
        {showFavoriteButton && (
          <Button 
            variant="link" 
            className="favorite-btn position-absolute"
            onClick={handleFavoriteToggle}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <i className={`bi ${favorite ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
          </Button>
        )}
      </div>
      <Card.Body>
        <Card.Title>{title || 'Recipe Title'}</Card.Title>
        <Card.Text>
          {description || 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'}
        </Card.Text>
        <Button 
          variant="primary" 
          onClick={() => onViewRecipe && onViewRecipe(id)}
        >
          View Recipe
        </Button>
      </Card.Body>
    </Card>
  );
}

export default BasicExample;