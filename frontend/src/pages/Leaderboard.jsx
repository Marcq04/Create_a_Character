import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { GET_LEADERBOARD } from '../graphql/queries';

const Leaderboard = () => {
  const { loading, error, data } = useQuery(GET_LEADERBOARD, {
    variables: { limit: 10 },
  });

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

