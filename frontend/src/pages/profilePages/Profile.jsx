import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ME } from '../../graphql/queries';
import './Profile.css';

const Profile = () => {
  const { data, loading, error } = useQuery(ME);
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { me: user } = data;

  return (
    <div className="profile">
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>
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

      <button onClick={() => navigate('/home')}>Go Back to Home</button>
    </div>
  );
};

export default Profile;

