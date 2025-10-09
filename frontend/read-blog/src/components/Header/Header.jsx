import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useContext } from 'react';
import { UserContext } from '../../App';

function Header() {
  const { user, setToken } = useContext(UserContext);

  const navigate = useNavigate();

  function handleLogout() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      setToken(null);
      navigate('/');
    }
  }

  return (
    <header>
      <nav>
        <ul className={styles.links}>
          {user ? (
            <>
              <li>
                <Link to="/" className={styles.link}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/account" className={styles.link}>
                  My Account
                </Link>
              </li>
              <li>
                <button type="button" className={styles.link} onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className={styles.link}>
                Log In
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <hr />
    </header>
  );
}

export default Header;
