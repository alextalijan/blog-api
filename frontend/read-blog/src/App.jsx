import { useEffect, useState } from 'react';
import Post from './components/Post/Post';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not fetch posts.');
        }

        return response.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1>Posts</h1>
      {error && <p>{error.message}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="posts">
          {posts.map((post) => {
            return (
              <Post
                key={post.id}
                title={post.title}
                text={post.text}
                date={post.updatedAt}
                author={post.author.username}
                numOfComments={post._count.comments}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default App;
