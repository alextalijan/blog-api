import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { UserContext } from '../../App';

function LoginPage() {
  const [error, setError] = useState(null);

  const { login } = useContext(UserContext);

  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();

    // Send a post request to the server to log in
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: event.target.username.value,
        password: event.target.password.value,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setError(response.message);
        }

        login(response.token);
        navigate('/');
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  return (
    <>
      <h1 className={styles.h1}>Log In</h1>
      {error && <p className={styles['login-error']}>{error}</p>}
      <form action="" method="POST" className={styles.form} onSubmit={handleLogin}>
        <div className={styles.field}>
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" className={styles.input} />
        </div>
        <button type="submit" className={styles['login-btn']}>
          Log In
        </button>
      </form>
    </>
  );
}

export default LoginPage;
