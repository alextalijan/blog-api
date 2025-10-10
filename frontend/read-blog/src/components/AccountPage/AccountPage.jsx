import { useContext } from 'react';
import { UserContext } from '../../App';

function AccountPage() {
  const { user } = useContext(UserContext);

  function handlePasswordChange(event) {}

  return (
    <>
      <h1>My Account</h1>
      <p>Welcome back {user.username}</p>
      <h2>Change Password</h2>
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
