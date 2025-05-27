import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_BOUNTY } from '../../graphql/mutations';
import { GET_USER_CHARACTERS } from '../../graphql/queries';

const CreateBounties = () => {
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [aiAllowed, setAiAllowed] = useState(false);

  const navigate = useNavigate();
  const [createBounty, { loading, error }] = useMutation(CREATE_BOUNTY, {
    onCompleted: () => navigate('/bounties'),
  });

  const { data: characterData, loading: characterLoading } = useQuery(
    GET_USER_CHARACTERS
  );

  useEffect(() => {
    if (characterData && characterData.getUserCharacters.length > 0) {
      setSelectedCharacter(characterData.getUserCharacters[0].id);
    }
  }, [characterData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createBounty({
      variables: {
        character: selectedCharacter,
        description,
        deadline: new Date(deadline).toISOString(),
        aiAllowed,
      },
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h2>Create a New Bounty</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Character:</label>
          <select
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            disabled={characterLoading || !characterData}
          >
            {!characterLoading &&
              characterData &&
              characterData.getUserCharacters.map((character) => (
                <option key={character._id} value={character._id}>
                  {character.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Deadline:</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={today}
            required
          />
        </div>
        <div>
          <label>AI Allowed:</label>
          <input
            type="checkbox"
            checked={aiAllowed}
            onChange={() => setAiAllowed(!aiAllowed)}
          />
        </div>
        <button
          type="submit"
          disabled={
            loading ||
            !selectedCharacter ||
            characterLoading ||
            !characterData
          }
        >
          {loading ? 'Creating...' : 'Create Bounty'}
        </button>
      </form>
      {error && <p>Error: {error.message}</p>}
      <button onClick={() => navigate('/bounties')}>Back to Bounties</button>
    </div>
  );
};

export default CreateBounties;

