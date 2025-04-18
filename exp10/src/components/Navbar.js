import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      fixed="top" 
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
    >
      <Container className="navbar-container">
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          Recipe Master
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar-nav">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <i className="bi bi-house me-1"></i> Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/recipes" 
              className={`navbar-link ${location.pathname === '/recipes' ? 'active' : ''}`}
            >
              <i className="bi bi-grid me-1"></i> Recipes
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/myrecipes" 
              className={`navbar-link ${location.pathname === '/myrecipes' ? 'active' : ''}`}
            >
              <i className="bi bi-collection me-1"></i> My Recipes
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/favorites" 
              className={`navbar-link ${location.pathname === '/favorites' ? 'active' : ''}`}
            >
              <i className="bi bi-heart me-1"></i> Favorites
            </Nav.Link>
            
            {user ? (
              <NavDropdown 
                title={
                  <span className="user-greeting">
                    <i className="bi bi-person-circle me-1"></i>
                    Hello, {user.username}
                  </span>
                } 
                id="user-dropdown"
                align="end"
                className="navbar-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="bi bi-person me-2"></i>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex auth-buttons">
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/signup" 
                  className={`navbar-link auth-signup ${location.pathname === '/signup' ? 'active' : ''}`}
                >
                  <i className="bi bi-person-plus me-1"></i> Signup
                </Nav.Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
