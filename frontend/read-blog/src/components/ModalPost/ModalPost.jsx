import { useEffect, useState, useContext, useRef } from 'react';
import styles from './ModalPost.module.css';
import prettifyDate from '../../utils/prettifyDate';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

function ModalPost({ postId, handleClick }) {
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);
  const [comments, setComments] = useState([]);
  const [postCommentError, setPostCommentError] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [refreshComments, setRefreshComments] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);

  const { user, token } = useContext(UserContext);

  // Capture reference to the edit comment text area
  const editComment = useRef(null);

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
  }, [postId, refreshComments]);

  function handlePostComment(event) {
    event.preventDefault();
    // First refresh the error for posting a comment
    setPostCommentError(null);

    fetch(`http://localhost:3000/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: event.target.comment.value.trim(),
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setPostCommentError(response.message);
        }

        setRefreshComments((prev) => !prev);
        event.target.comment.value = '';
      })
      .catch((error) => {
        setPostCommentError(error.message);
      });
  }

  function handleDeleteComment(id) {
    fetch(`http://localhost:3000/posts/${postId}/comments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return alert(response.message);
        }

        setRefreshComments((prev) => !prev);
      })
      .catch((error) => {
        alert(error);
      });
  }

  function handleUpdateComment(id) {
    console.log(editComment.current);

    fetch(`http://localhost:3000/posts/${postId}/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: editComment.current.value.trim(),
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return alert(response.message);
        }

        setRefreshComments((prev) => !prev);
      })
      .catch((error) => {
        alert(error.message);
      });
  }

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
              <span className={styles['comments-count']}>{comments.length} Comments</span>
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
              <>
                {postCommentError && (
                  <p className={styles['postcomment-error']}>{postCommentError}</p>
                )}
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
              </>
            )}
            <b className={styles['comments-heading']}>Comments:</b>
            {comments.length === 0 ? (
              <p className={styles['no-comments-msg']}>No comments yet.</p>
            ) : (
              <div className={styles.comments}>
                {comments.map((comment) => {
                  return (
                    <div key={comment.id} className={styles.comment}>
                      <div className={styles['comment-header']}>
                        <b className={styles.commenter}>{comment.user.username}</b>
                        {comment.user.id === user.id && (
                          <>
                            <button
                              type="button"
                              className={`${styles['comment-btn']} ${styles['comment-edit-btn']}`}
                              onClick={
                                editCommentId !== comment.id
                                  ? () => setEditCommentId(comment.id)
                                  : () => {
                                      handleUpdateComment(comment.id);
                                      setEditCommentId(null);
                                    }
                              }
                            >
                              {editCommentId === comment.id ? 'Done' : 'Edit'}
                            </button>
                            <button
                              type="button"
                              className={`${styles['comment-btn']} ${styles['comment-delete-btn']}`}
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                      {editCommentId !== comment.id ? (
                        <p className={styles['comment-text']}>{comment.text}</p>
                      ) : (
                        <textarea
                          className={styles['edit-comment-text']}
                          ref={editComment}
                          defaultValue={comment.text}
                          rows={3}
                        ></textarea>
                      )}
                      <p className={styles['comment-date']}>
                        Posted: {prettifyDate(comment.createdAt)}
                      </p>
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
