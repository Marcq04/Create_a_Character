import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({
            query: `
              query GetLeaderboard($limit: Int!) {
                getLeaderboard(limit: $limit) {
                  id
                  username
                  honor
                  title
                }
              }
            `,
            variables: { limit: 1 },
          }),
        });

        const result = await response.json();
        setData(result.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p>Error loading leaderboard: {error.message}</p>;

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {data.getLeaderboard.map((user, index) => (
          <li key={user.id}>
            <strong>{index + 1}.</strong> {user.username} - Honor: {user.honor} - Title: {user.title}
          </li>
        ))}
      </ul>
      <Link to="/home">
        <button type="button">Back to Home</button>
      </Link>
    </div>
  );
};

export default Leaderboard;

