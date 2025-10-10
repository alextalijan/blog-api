import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

function App() {
  const tokenRef = useRef(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    // If there isn't a stored user token, user is empty
    const token = tokenRef.current;
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      // expire check (exp is seconds since epoch)
      if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        localStorage.removeItem('token');
        tokenRef.current = null;
        return null;
      }

      return {
        id: decoded.userId,
        username: decoded.username,
      };
    } catch {
      // invalid token -> clear it
      localStorage.removeItem('token');
      tokenRef.current = null;
      return null;
    }
  });

  function login(token) {
    try {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.userId, username: decoded.username });

      // Save the token in storage
      localStorage.setItem('token', token);
      tokenRef.current = token;
    } catch {
      // invalid token
      console.error('Invalid token.');
    }
  }

  return (
    <UserContext.Provider value={{ user, tokenRef, login }}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Protected routes */}
          <Route element={<PrivateRoute />}></Route>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
