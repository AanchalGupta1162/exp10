import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Recipes from './pages/Recipes';
import Myrecipes from './pages/Myrecipes';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/myrecipes" element={<Myrecipes />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
          <Footer />
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
