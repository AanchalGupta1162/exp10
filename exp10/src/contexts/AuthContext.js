// import React, { createContext, useState, useEffect, useContext } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check if user is already logged in when the app loads
//   useEffect(() => {
//     const user = localStorage.getItem('user');
//     if (user) {
//       setCurrentUser(JSON.parse(user));
//     }
//     setLoading(false);
//   }, []);

//   // Login function
//   const login = async (email, password) => {
//     try {
//       // This would be replaced with an actual API call to your backend
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         throw new Error('Login failed');
//       }

//       const data = await response.json();
//       const user = {
//         id: data.user.id,
//         name: data.user.name,
//         email: data.user.email,
//         token: data.token,
//       };

//       // Save user to local storage
//       localStorage.setItem('user', JSON.stringify(user));
//       setCurrentUser(user);
//       return user;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   // Signup function
//   const signup = async (name, email, password) => {
//     try {
//       // This would be replaced with an actual API call to your backend
//       const response = await fetch('http://localhost:5000/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name, email, password }),
//       });

//       if (!response.ok) {
//         throw new Error('Signup failed');
//       }

//       const data = await response.json();
//       // After signup, auto-login
//       return login(email, password);
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem('user');
//     setCurrentUser(null);
//   };

//   const value = {
//     currentUser,
//     login,
//     signup,
//     logout,
//     loading
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };