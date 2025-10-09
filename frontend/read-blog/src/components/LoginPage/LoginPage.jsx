import styles from './LoginPage.module.css';

function LoginPage() {
  return (
    <>
      <h1 className={styles.h1}>Log In</h1>
      <form action="" method="POST" className={styles.form}>
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
