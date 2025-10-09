import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/account">My Account</Link>
          </li>
          <li>
            <button type="button">Log Out</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
