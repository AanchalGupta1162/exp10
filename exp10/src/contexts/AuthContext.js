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
    // First check if the response is actually JSON
    return JSON.parse(text);
  } catch (e) {
    // If it's HTML or other non-JSON format, throw a more descriptive error
    if (text.includes('<!DOCTYPE html>')) {
      console.error('Received HTML instead of JSON. Backend may be unavailable.');
      throw new Error('Server error: Received HTML instead of JSON. The server may be down or not accessible.');
    }
    throw new Error(`Failed to parse response: ${text}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState('online');
  const navigate = useNavigate();

  // Initialize auth state on component mount
  useEffect(() => {
    checkAuthStatus();
    
    // Set up periodic server checks
    const serverCheckInterval = setInterval(() => {
      pingServer();
    }, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(serverCheckInterval);
    };
  }, []);
  
  // Monitor server status changes
  useEffect(() => {
    if (serverStatus === 'offline' && user) {
      // Server is offline but user is logged in - log them out
      handleLogout(true);
    }
  }, [serverStatus]);

  // Function to ping server and check its status
  const pingServer = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/ping', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        await safeParseJSON(response); // Make sure we can parse the response
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      console.log('Server connection error:', error);
      setServerStatus('offline');
    }
  };

  // Check authentication status with server
  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      
      // First check if we have a stored user
      if (storedUser) {
        // We have a stored user, but validate with server to ensure session is still valid
        try {
          const response = await fetch('http://localhost:5000/api/auth/check-auth', {
            method: 'GET',
            credentials: 'include',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await safeParseJSON(response);
            if (data.user) {
              // Session is valid, update with server data
              setUser(data.user);
              localStorage.setItem('user', JSON.stringify(data.user));
              setServerStatus('online');
            } else {
              // Session expired on server but we have local data
              localStorage.removeItem('user');
              setUser(null);
            }
          } else {
            // Server rejected authentication
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          // Server error or offline - keep stored user for now
          // but mark server as offline
          setUser(JSON.parse(storedUser));
          setServerStatus('offline');
        }
      } else {
        // No stored user, check if there's an active session on server
        try {
          const response = await fetch('http://localhost:5000/api/auth/check-auth', {
            method: 'GET',
            credentials: 'include',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await safeParseJSON(response);
            if (data.user) {
              setUser(data.user);
              localStorage.setItem('user', JSON.stringify(data.user));
              setServerStatus('online');
            }
          }
        } catch (error) {
          console.error('Error checking for existing session:', error);
          setServerStatus('offline');
        }
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
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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

  // Logout function
  const handleLogout = async (skipApiCall = false) => {
    if (!skipApiCall) {
      try {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    // Always clear local state regardless of API response
    localStorage.removeItem('user');
    setUser(null);
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