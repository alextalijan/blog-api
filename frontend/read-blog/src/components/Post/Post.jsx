import prettifyDate from '../../utils/prettifyDate';
import styles from './Post.module.css';
import { Link } from 'react-router-dom';

function Post({ title, text, date, numOfComments, handleClick, author = null }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      {author && (
        <span className={styles.author}>
          Author: <Link to={`/authors/${author.id}`}>{author.username}</Link>
        </span>
      )}
      <p className={styles.text}>{text}</p>
      <div className={styles.footer}>
        <span className={styles.date}>Posted on {prettifyDate(date)}</span>
        <button type="button" className={styles['comments-btn']} onClick={handleClick}>
          {numOfComments} Comments
        </button>
      </div>
    </div>
  );
}

export default Post;
