import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import Layout from './components/Layout/Layout';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import AccountPage from './components/AccountPage/AccountPage';

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // On the initial mount, set the token from local storage
  useEffect(() => {
    const storageToken = localStorage.getItem('token');
    if (storageToken) {
      const decoded = jwtDecode(storageToken);

      // Check if the token has expired
      if (decoded.exp > Date.now() / 1000) {
        setToken(storageToken);
      } else {
        // Delete the token from localStorage
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Every time the token changes, set the user
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.userId, username: decoded.username });
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setToken }}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
