import { useEffect, useState } from 'react';
import './HomePage.css';
import Post from '../Post/Post';
import ModalPost from '../ModalPost/ModalPost';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePostId, setActivePostId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error(error);
        setError(new Error('Failed to fetch posts. Please try again.'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1 className="h1">Posts</h1>
      {error && <p className="error">{error.message}</p>}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="posts">
          {posts.map((post) => {
            return (
              <Post
                key={post.id}
                title={post.title}
                text={post.text}
                date={post.updatedAt}
                author={post.author}
                numOfComments={post._count.comments}
                handleClick={() => setActivePostId(post.id)}
              />
            );
          })}
        </div>
      )}
      {activePostId && (
        <ModalPost postId={activePostId} handleClick={() => setActivePostId(null)} />
      )}
    </>
  );
}

export default HomePage;
