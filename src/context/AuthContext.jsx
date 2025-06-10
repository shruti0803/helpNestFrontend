// // AuthContext.js
// import React, { createContext, useContext, useEffect, useState } from 'react';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // Optional: handle loading state

//   // Fetch user from cookie on load
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/users/me', {
//           credentials: 'include', // send cookies
//         });
//         if (!res.ok) throw new Error('Not authenticated');
//         const data = await res.json();
//         setUser(data);
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Called after login API success
//   const login = (userData) => {
//     setUser(userData);
//   };

//   const logout = async () => {
//     await fetch('http://localhost:5000/api/users/logout', {
//       method: 'POST',
//       credentials: 'include',
//     });
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
