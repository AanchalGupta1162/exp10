import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (res.ok) {
      alert("Registration successful");
      navigate('/login');
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input name="username" type="text" placeholder="Username" onChange={handleChange} className="form-control mb-3" required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="form-control mb-3" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="form-control mb-3" required />
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
