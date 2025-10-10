import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Post from '../Post/Post';
import styles from './AuthorPage.module.css';

function AuthorPage() {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [authorLoading, setAuthorLoading] = useState(true);
  const [authorError, setAuthorError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsError, setPostsError] = useState(null);
  const [postsLoading, setPostsLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch the author
  useEffect(() => {
    fetch(`http://localhost:3000/users/${authorId}`)
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setAuthorError(response.message);
        }

        setAuthor(response.user);
      })
      .catch(() => setAuthorError("Failed to fetch author's name."))
      .finally(() => setAuthorLoading(false));
  }, [authorId]);

  // Fetch author's posts
  useEffect(() => {
    fetch(`http://localhost:3000/users/${authorId}/posts`)
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setPostsError(response.message);
        }

        setPosts(response.posts);
      })
      .catch((error) => setPostsError(error.message))
      .finally(() => setPostsLoading(false));
  });

  return (
    <>
      {authorError ? (
        <p className={styles.h1}>{authorError}</p>
      ) : authorLoading ? (
        <p className={`${styles.loading} ${styles.h1}`}>Loading author...</p>
      ) : (
        <h1 className={styles.h1}>Posts by {author.username}</h1>
      )}
      {postsError ? (
        <p className={styles['posts-error']}>{postsError}</p>
      ) : postsLoading ? (
        <p className={`${styles.loading} ${styles['loading-posts']}`}>Loading posts...</p>
      ) : (
        <div className={styles.posts}>
          {posts.map((post) => {
            return (
              <Post
                key={post.id}
                title={post.title}
                text={post.text}
                date={post.updatedAt}
                numOfComments={post._count.comments}
                handleClick={() => navigate(`/posts/${post.id}`)}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default AuthorPage;
