import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';

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

  return (
    <>
      <h1>My Account</h1>
      <p>Welcome back {user.username}</p>
      <h2>Change Password</h2>
      {error && <p>{error}</p>}
      <form action="" method="PUT" onSubmit={handlePasswordChange}>
        <label htmlFor="password">New Password:</label>
        <input type="password" name="password" id="password" />
        <label htmlFor="passwordConfirmation">Confirm Password:</label>
        <input type="password" name="passwordConfirmation" id="passwordConfirmation" />
        <button type="submit">Change</button>
      </form>
    </>
  );
}

export default AccountPage;
