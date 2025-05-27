import { useQuery, useMutation, gql } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { GET_USER_BOUNTIES } from '../../graphql/queries';
import { DELETE_BOUNTY } from '../../graphql/mutations';

const Bounties = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(GET_USER_BOUNTIES);
  const [deleteBounty] = useMutation(DELETE_BOUNTY, {
    onCompleted: () => refetch(),
  });

  if (loading) return <p>Loading...</p>;

  if (error) {
    console.error(error);
    return <p>Error loading bounties</p>;
  }

  if (!data || !data.getUserBounties) {
    console.log('No bounties found');
    return <p>No bounties found</p>;
  }

  const bounties = data.getUserBounties;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bounty?')) {
      deleteBounty({ variables: { bountyId: id } });
    }
  };

  return (
    <div>
      <h2>Your Bounties</h2>
      <ul>
        {bounties.map(bounty => (
          <li key={bounty.id}>
            {bounty.description} - {new Date(bounty.deadline).toDateString()}
            <button onClick={() => navigate(`/update_bounties/${bounty.id}`)}>Update</button>
            <button onClick={() => handleDelete(bounty.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/create_bounties')}>Create Bounty</button>
      <button onClick={() => navigate('/home')}>Back to Home</button>
    </div>
  );
};

export default Bounties;

