import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header>
      <nav>
        <ul className={styles.links}>
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
            <button type="button" className={styles.link}>
              Log Out
            </button>
          </li>
        </ul>
      </nav>
      <hr />
    </header>
  );
}

export default Header;
