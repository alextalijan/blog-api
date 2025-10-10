import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, createContext, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Layout from './components/Layout/Layout';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import AccountPage from './components/AccountPage/AccountPage';

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const tokenRef = useRef(localStorage.getItem('token'));

  // On the initial mount, load the user if he exists
  useEffect(() => {
    const token = tokenRef.current;
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.userId, username: decoded.username });
    } catch {
      localStorage.removeItem('token');
      tokenRef.current = null;
    }
  }, []);

  function login(token) {
    localStorage.setItem('token', token);
    tokenRef.current = token;

    try {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.userId, username: decoded.username });
    } catch {
      console.error('Invalid token');
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, tokenRef, login }}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            {/* Protected section */}
            <Route element={<PrivateRoute />}>
              <Route path="/account" element={<AccountPage />} />
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
