# Recipe Master

Recipe Master is a full-stack web application that allows users to discover, create, and manage their favorite recipes. Built with React and Node.js, it provides a seamless experience for recipe enthusiasts to explore culinary creations and maintain their own personal collection.

![Recipe Master](https://github.com/yourusername/recipe-master/raw/main/screenshots/home.png)

## Features

- **User Authentication**: Secure login and registration system with session management
- **Recipe Discovery**: Browse through a collection of recipes from various users
- **Personal Recipe Management**: Create, edit, and delete your own recipes
- **Favorites Collection**: Save your favorite recipes for quick access
- **Responsive Design**: Enjoy a seamless experience across desktop and mobile devices

## Technology Stack

### Frontend
- React 19.1.0
- React Router 7.5.0
- React Bootstrap 2.10.9
- Bootstrap 5.3.5
- Context API for state management

### Backend
- Node.js with Express 5.1.0
- MongoDB with Mongoose 8.13.2
- Express Session for authentication
- Bcrypt.js for password hashing
- CORS for cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas connection)
- npm or yarn package manager

### Installation

1. Clone the repository
   ```
   git clone https://github.com/AanchalGupta1162/exp10.git
   cd recipe-master
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/your_database_name
   ```

4. Install frontend dependencies
   ```
   cd ../exp10
   npm install
   ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```
   cd exp10
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
recipe-master/
├── backend/                # Node.js Express backend
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware functions
│   ├── models/             # MongoDB schema models
│   ├── routes/             # API route definitions
│   └── server.js           # Entry point for the backend
│
└── exp10/                  # React frontend
    ├── public/             # Static files
    └── src/                # React source code
        ├── assets/         # Images and media
        ├── components/     # Reusable UI components
        ├── contexts/       # Context API providers
        ├── pages/          # Page components
        └── styles/         # CSS stylesheets
```

## Usage

1. **Registration and Login**
   - Create a new account using the Sign Up page
   - Log in with your credentials

2. **Exploring Recipes**
   - Browse all recipes on the Recipes page
   - Click on any recipe card to view details

3. **Managing Your Recipes**
   - Navigate to "My Recipes" to see your creations
   - Use the "Add New Recipe" button to create a recipe
   - Edit or delete your existing recipes

4. **Managing Favorites**
   - Click the heart icon on any recipe to add it to favorites
   - View your saved recipes in the Favorites section

## Common Issues and Fixes

### Cross-Origin Resource Sharing (CORS)
If you encounter CORS issues:
- Ensure the backend CORS configuration includes the frontend origin
- Verify that `credentials: 'include'` is set on frontend fetch requests
- Check that the backend CORS settings include `credentials: true`

### Authentication Problems
- Clear your browser's local storage and cookies
- Ensure MongoDB is running and accessible
- Verify that session configuration is properly set up in the backend

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape this project although they have already thanked themselves (wink wink)
- Bootstrap and React Bootstrap for the responsive UI components
- MongoDB for the flexible document database