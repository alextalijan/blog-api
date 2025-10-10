import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import styles from './AccountPage.module.css';

function AccountPage() {
  const [error, setError] = useState(null);

  const { user, token } = useContext(UserContext);

  const navigate = useNavigate();

  function handlePasswordChange(event) {
    event.preventDefault();

    fetch(`http://localhost:3000/users/${user.id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: event.target.password.value,
        passwordConfirmation: event.target.passwordConfirmation.value,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setError(response.message);
        }

        navigate('/');
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  // If the user hasn't loaded yet
  if (!user) return <p>Loading account...</p>;

  return (
    <>
      <h1 className={styles.h1}>My Account</h1>
      <p className={styles['welcome-message']}>Welcome back {user.username}.</p>
      <hr />
      <h2 className={styles['change-password-heading']}>Change Password</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form action="" method="PUT" onSubmit={handlePasswordChange} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            className={styles['password-input']}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="passwordConfirmation">Confirm Password:</label>
          <input
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            className={styles['password-input']}
          />
        </div>
        <button type="submit" className={styles['change-password-btn']}>
          Change
        </button>
      </form>
    </>
  );
}

export default AccountPage;
