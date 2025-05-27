import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GET_USER_BOUNTIES } from '../../graphql/queries';
import { UPDATE_BOUNTY } from '../../graphql/mutations';

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

const UpdateBounties = () => {
  const [bountyId, setBountyId] = useState('');
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [aiAllowed, setAiAllowed] = useState(false);

  const navigate = useNavigate();
  const { data: userBounties, loading: bountiesLoading } = useQuery(GET_USER_BOUNTIES);
  const [updateBounty, { loading: updating, error }] = useMutation(UPDATE_BOUNTY, {
    onCompleted: () => navigate('/bounties'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBounty || !isValidObjectId(selectedBounty._id)) {
      alert('Please select a valid bounty');
      return;
    }
    updateBounty({
      variables: {
        bountyId: selectedBounty._id,
        description,
        deadline: new Date(deadline).toISOString(),
        aiAllowed,
      },
    });
  };

  return (
    <div>
      <h2>Update Bounty</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={bountyId}
          onChange={(e) => setBountyId(e.target.value)}
          required
        >
          <option value="">Select a bounty</option>
          {!bountiesLoading &&
            userBounties.getUserBounties.map((bounty) => (
              <option key={bounty._id} value={bounty._id}>
                {bounty.description}
              </option>
            ))}
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
        />
        <input
          type="checkbox"
          checked={aiAllowed}
          onChange={() => setAiAllowed(!aiAllowed)}
        />
        <label>AI Allowed</label>
        <button type="submit" disabled={updating || bountiesLoading}>
          {updating ? 'Updating...' : 'Update Bounty'}
        </button>
        <button onClick={() => navigate('/bounties')}>Back to Bounties</button>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default UpdateBounties;

