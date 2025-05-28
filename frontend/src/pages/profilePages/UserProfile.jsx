import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../graphql/queries';
import './Profile.css';

const UserProfile = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id },
  });
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data.getUserById;

  return (
    <div className="profile">
      <h2>{user.username}</h2>
      <p>Honor: {user.honor}</p>
      <p>Title: {user.title}</p>
      <p>Role: {user.role}</p>

      <h3>Characters</h3>
      <ul>
        {user.characters.length > 0 ? (
          user.characters.map(character => (
            <li key={character.id}>
              <Link to={`/characters/${character.id}`}>
                <p>{character.name}</p>
              </Link>
            </li>
          ))
        ) : (
          <p>No characters found.</p>
        )}
      </ul>

      <button onClick={() => navigate('/community')}>Go Back to Community</button>
    </div>
  );
};

export default UserProfile;

