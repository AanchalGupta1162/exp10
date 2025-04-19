// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function Login({ setUser }) {
//     const [formData, setFormData] = useState({ email: '', password: '' });
//     const navigate = useNavigate();
  
//     const handleChange = (e) => {
//       setFormData({...formData, [e.target.name]: e.target.value });
//     };
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       const res = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//         'credentials': 'include' // Include credentials for session management
//       });
  
//       const data = await res.json();
//       if (res.ok) {
//         localStorage.setItem('user', JSON.stringify(data.user));
//         setUser(data.user); // ✅ update navbar immediately
//         navigate('/');
//       } else {
//         alert(data.message || "Login failed");
//       }
//     };
  
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <div className="card p-4" style={{ width: '400px' }}>
//           <h2 className="text-center">Login</h2>
//           <form onSubmit={handleSubmit}>
//             <input name="email" type="email" placeholder="Email" onChange={handleChange} className="form-control mb-3" required />
//             <input name="password" type="password" placeholder="Password" onChange={handleChange} className="form-control mb-3" required />
//             <button type="submit" className="btn btn-primary w-100">Login</button>
//           </form>
//         </div>
//       </div>
//     );
// }

// export default Login;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }
      
      // Redirect will happen automatically via the useEffect when user state updates
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check for messages from redirects (like from signup page)
  const message = location.state?.message || '';

  return (
    <Container className="py-5 mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Sign in to continue to Recipe Master</p>
              </div>

              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" className="py-2" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-decoration-none">
                    Sign Up
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
