import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function ColorSchemesExample({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
      <Container className="navbar-container">
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          Recipe Master
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto navbar-nav">
            <Nav.Link as={Link} to="/" className="navbar-link">Home</Nav.Link>
            <Nav.Link as={Link} to="/recipes" className="navbar-link">Recipes</Nav.Link>
            <Nav.Link as={Link} to="/myrecipes" className="navbar-link">My Recipes</Nav.Link>
            <Nav.Link as={Link} to="/favorites" className="navbar-link">Favorites</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {user ? (
              <>
                <span className="navbar-text text-white me-3">
                  Hello, {user.username}
                </span>
                <Nav.Link onClick={handleLogout} className="navbar-link">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="navbar-link">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="navbar-link">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default ColorSchemesExample;
