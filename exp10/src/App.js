import './App.css';
import React, { useEffect, useState } from 'react';
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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  return (
    <FavoritesProvider>
      <Router>
      <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/myrecipes" element={<Myrecipes />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
        <Footer />
      </Router>
    </FavoritesProvider>
  );
}

export default App;
