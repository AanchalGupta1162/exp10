import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Helper function to safely parse JSON responses
const safeParseJSON = async (response) => {
  const text = await response.text();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    if (text.includes('<!DOCTYPE html>')) {
      console.error('Received HTML instead of JSON. Backend may be unavailable.');
      throw new Error('Server error: Received HTML instead of JSON. The server may be down or not accessible.');
    }
    throw new Error(`Failed to parse response: ${text}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize from localStorage on mount
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState('online');
  const navigate = useNavigate();

  // Initialize auth state on component mount - only once
  useEffect(() => {
    // Only check auth status once when component mounts
    checkAuthStatus();
    
    // No more periodic checks that cause refreshes
  }, []); // Empty dependency array means this runs only on mount
  
  // Monitor server status changes
  useEffect(() => {
    if (serverStatus === 'offline' && user) {
      // Server is offline but user is logged in - log them out
      handleLogout(true);
    }
  }, [serverStatus]);

  // Check authentication status with server - run this manually, not automatically
  const checkAuthStatus = async () => {
    setLoading(true);
    
    try {
      // Check with the server
      const response = await fetch('http://localhost:5000/api/auth/check-auth', {
        method: 'GET',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await safeParseJSON(response);
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          setServerStatus('online');
        } else {
          // No user in response but response was ok
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        // Server says not authenticated
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Keep stored user if there is one, but this is offline mode
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setServerStatus('offline');
      }
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        } else if (response.status === 401) {
          throw new Error('Invalid email or password');
        }
        
        try {
          const errorData = await safeParseJSON(response);
          throw new Error(errorData.message || 'Login failed');
        } catch (parseError) {
          throw new Error('Login failed: Server error');
        }
      }
      
      const data = await safeParseJSON(response);

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setServerStatus('online');
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  };

  // Fixed logout function
  const handleLogout = async (skipApiCall = false) => {
    // First clear local state to immediately update UI
    localStorage.removeItem('user');
    setUser(null);
    
    if (!skipApiCall) {
      try {
        // Then make the API call to clear the server-side session
        const response = await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error("Server logout failed, but user has been logged out locally");
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    // Navigate after logout is complete
    navigate('/');
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // Add credentials for consistent behavior
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        try {
          const errorData = await safeParseJSON(response);
          throw new Error(errorData.message || 'Registration failed');
        } catch (parseError) {
          throw new Error('Registration failed: Server error');
        }
      }
      
      const data = await safeParseJSON(response);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  };

  const value = {
    user,
    loading,
    serverStatus,
    login,
    logout: handleLogout,
    register,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};