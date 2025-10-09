import { useEffect, useState, useContext } from 'react';
import styles from './ModalPost.module.css';
import prettifyDate from '../../utils/prettifyDate';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

function ModalPost({ postId, handleClick }) {
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  const { user } = useContext(UserContext);

  // Fetch the post
  useEffect(() => {
    fetch(`http://localhost:3000/posts/${postId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then((data) => {
        setPost(data);
      })
      .catch((error) => {
        console.error(error);
        setPostError(new Error('Failed fetching the post. Please try again.'));
      })
      .finally(() => {
        setLoadingPost(false);
      });
  }, [postId]);

  // Fetch the comments
  useEffect(() => {
    fetch(`http://localhost:3000/posts/${postId}/comments`)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then((data) => {
        setComments(data);
      })
      .catch((error) => {
        console.error(error);
        setCommentsError(new Error('Could not load comments.'));
      })
      .finally(() => {
        setLoadingComments(false);
      });
  }, [postId]);

  function handlePostComment() {}

  return (
    <>
      <div
        className={styles['modal-backdrop']}
        role="button"
        tabIndex="0"
        onKeyDown={handleClick}
        onClick={handleClick}
      ></div>
      <dialog open className={styles.modal}>
        {postError ? (
          <p className={styles['post-error']}>{postError.message}</p>
        ) : loadingPost ? (
          <p className={`${styles.loading} ${styles['post-loading']}`}>Loading the post...</p>
        ) : (
          <div className={styles.post}>
            <span className={styles.title}>
              <b>{post.title}</b> by {post.author.username}
            </span>
            <p className={styles.text}>{post.text}</p>
            <div className={styles['post-footer']}>
              <span className={styles.date}>Posted on {prettifyDate(post.updatedAt)}</span>
              <span className={styles['comments-count']}>{post._count.comments} Comments</span>
            </div>
            <hr />
          </div>
        )}
        {commentsError && <p className={styles['comments-error']}>{commentsError.message}</p>}
        {loadingComments ? (
          <p className={`${styles.loading} ${styles['comments-loading']}`}>Loading comments...</p>
        ) : (
          <div className={styles.comments}>
            {!user ? (
              <p className={styles['login-message']}>
                <Link to="/login">Log in</Link> to be able to comment.
              </p>
            ) : (
              <form
                action={`http://localhost:3000/posts/${postId}/comments`}
                method="POST"
                onSubmit={handlePostComment}
                className={styles['add-comment-form']}
              >
                <label htmlFor="comment">Add Comment:</label>
                <textarea
                  name="text"
                  id="comment"
                  className={styles['comment-content']}
                  rows={4}
                ></textarea>
                <button type="submit" className={styles['add-comment-btn']}>
                  Submit
                </button>
              </form>
            )}
            <b className={styles['comments-heading']}>Comments:</b>
            {comments.length === 0 ? (
              <p className={styles['no-comments-msg']}>No comments yet.</p>
            ) : (
              <div className={styles.comments}>
                {comments.map((comment) => {
                  return (
                    <div key={comment.id} className={styles.comment}>
                      <b className={styles.commenter}>{comment.user.username}</b>
                      <p className={styles['comment-text']}>{comment.text}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

export default ModalPost;
