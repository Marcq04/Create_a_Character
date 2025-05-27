import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { UPDATE_CHARACTER } from '../../graphql/mutations';
import { GET_CHARACTER_BY_ID } from '../../graphql/queries';

const Update_Character = () => {
  const { id } = useParams(); // Get character ID from URL
  const navigate = useNavigate();

  const { data, loading } = useQuery(GET_CHARACTER_BY_ID, {
    variables: { id },
  });

  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    age: '',
    gender: '',
    origin: '',
    background: '',
    goal: '',
    weakness: '',
    personality: '',
    powers: '',
    skills: '',
    appearance: '',
  });

  const [updateCharacter, { error }] = useMutation(UPDATE_CHARACTER, {
    onCompleted: () => navigate('/characters'),
  });

  useEffect(() => {
    if (data && data.getCharacterById) {
      const char = data.getCharacterById;
      setFormData({
        name: char.name,
        nickname: char.nickname || '',
        age: char.age || '',
        gender: char.gender || '',
        origin: char.origin || '',
        background: char.background || '',
        goal: char.goal || '',
        weakness: char.weakness || '',
        personality: char.personality || '',
        powers: (char.powers || []).join(', '),
        skills: (char.skills || []).join(', '),
        appearance: char.appearance || '',
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCharacter({
      variables: {
        id,
        name: formData.name,
        nickname: formData.nickname,
        age: parseInt(formData.age),
        gender: formData.gender,
        origin: formData.origin,
        background: formData.background,
        goal: formData.goal,
        weakness: formData.weakness,
        personality: formData.personality,
        powers: formData.powers.split(',').map(p => p.trim()),
        skills: formData.skills.split(',').map(s => s.trim()),
        appearance: formData.appearance,
      },
    });
  };

  if (loading) return <p>Loading character...</p>;

  return (
    <div>
      <h2>Update Character</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <input
            key={key}
            type={key === 'age' ? 'number' : 'text'}
            name={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={value}
            onChange={handleChange}
            required={key === 'name'}
          />
        ))}
        <button type="submit">Update Character</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      <button onClick={() => navigate('/characters')}>Go back to characters</button>
    </div>
  );
};

export default Update_Character;
