import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function AuthorPage() {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the author and his posts
  useEffect(() => {
    fetch(`http://localhost:3000/users/${authorId}`)
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setAuthorError(response.message);
        }

        setAuthor(response.user);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [authorId]);

  return (
    <>
      {author}
      loading && <p>Loading author...</p>}
    </>
  );
}

export default AuthorPage;
