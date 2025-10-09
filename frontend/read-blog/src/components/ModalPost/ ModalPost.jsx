import { useEffect, useState } from 'react';
import styles from './ModalPost.module.css';
import prettifyDate from '../../utils/prettifyDate';

function ModalPost({ postId, handleClick }) {
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

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

  function handleFormSubmit() {}

  return (
    <div>
      <button type="button" onClick={handleClick} className={styles['close-btn']}>
        Close
      </button>
      {postError && <p>{postError.message}</p>}
      {loadingPost ? (
        <p>Loading the post...</p>
      ) : (
        <div className={styles['post-card']}>
          <span className={styles.title}>{post.title}</span>
          <span className={styles.author}>Author: {post.author.username}</span>
          <p className={styles.text}>{post.text}</p>
          <span className={styles.date}>Posted on {prettifyDate(post.updatedAt)}</span>
          <span className={styles['comments-count']}>{post._count.comments} Comments</span>
        </div>
      )}
      {commentsError && <p>{commentsError.message}</p>}
      {loadingComments ? (
        <p>Loading comments...</p>
      ) : (
        <div className={styles.comments}>
          <form
            action={`http://localhost:3000/posts/${postId}/comments`}
            method="POST"
            onSubmit={handleFormSubmit}
          >
            <label htmlFor="comment">Comment:</label>
            <textarea name="text" id="comment"></textarea>
            <button type="submit">Submit</button>
          </form>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => {
              return (
                <div key={comment.id}>
                  <span>{comment.user.username}</span>
                  <p>{comment.text}</p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default ModalPost;
