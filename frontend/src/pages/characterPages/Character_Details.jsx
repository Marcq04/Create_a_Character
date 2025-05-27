import { useQuery, gql } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_CHARACTER_BY_ID } from '../../graphql/queries';

const Character_Details = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading } = useQuery(GET_CHARACTER_BY_ID, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;

  const character = data?.getCharacterById || {};

  return (
    <div>
      <h2>{character.name}</h2>
      <p>Nickname: {character.nickname}</p>
      <p>Age: {character.age}</p>
      <p>Gender: {character.gender}</p>
      <p>Origin: {character.origin}</p>
      <p>Background: {character.background}</p>
      <p>Goal: {character.goal}</p>
      <p>Weakness: {character.weakness}</p>
      <p>Personality: {character.personality}</p>
      <p>Powers: {character.powers?.join(', ')}</p>
      <p>Skills: {character.skills?.join(', ')}</p>
      <p>Appearance: {character.appearance}</p>
      <button onClick={() => navigate('/characters')}>Go Back</button>
    </div>
  );
};

export default Character_Details;

