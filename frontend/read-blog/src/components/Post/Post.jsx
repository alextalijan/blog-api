import prettifyDate from '../../utils/prettifyDate';
import styles from './Post.module.css';

function Post({ title, text, date, author, numOfComments }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <span className={styles.author}>Author: {author}</span>
      <p className={styles.text}>{text}</p>
      <div className={styles.footer}>
        <span className={styles.date}>Posted on {prettifyDate(date)}</span>
        <button type="button" className={styles['comments-btn']}>
          {numOfComments} Comments
        </button>
      </div>
    </div>
  );
}

export default Post;
