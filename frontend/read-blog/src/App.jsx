import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import AccountPage from './components/AccountPage/AccountPage';

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // On the initial mount, load user if he's authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);

      // Check if the token has expired
      if (decoded.exp > Date.now() / 1000) {
        setUser({ id: decoded.userId, username: decoded.username });
        setToken(token);
      } else {
        // Delete the token from localStorage
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, token, setUser, setToken }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
