import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { UPDATE_BOUNTY } from "../../graphql/mutations";
import { GET_BOUNTY_BY_ID } from "../../graphql/queries";

const Update_Bounties = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_BOUNTY_BY_ID, {
    variables: { id },
  });
  const [updateBounty, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_BOUNTY);
  const [description, setDescription] = useState(data?.getBountyById.description);
  const [deadline, setDeadline] = useState(data?.getBountyById.deadline);
  const [aiAllowed, setAiAllowed] = useState(data?.getBountyById.aiAllowed);

  useEffect(() => {
    if (data) {
      setDescription(data.getBountyById.description);
      setDeadline(data.getBountyById.deadline);
      setAiAllowed(data.getBountyById.aiAllowed);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;

  if (error) {
    console.error(error);
    return <p>Error loading bounty</p>;
  }

  if (!data || !data.getBountyById) {
    console.log("No bounty found");
    return <p>No bounty found</p>;
  }

  const handleUpdate = async () => {
    try {
      await updateBounty({
        variables: {
          bountyId: id,
          description,
          deadline,
          aiAllowed,
        },
      });
      navigate("/bounties");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Update Bounty</h2>
      <div>
        <label>Description:</label>
        <input
          type="text"
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
        />
      </div>
      <div>
        <label>AI Allowed:</label>
        <input
          type="checkbox"
          checked={aiAllowed}
          onChange={(e) => setAiAllowed(e.target.checked)}
        />
      </div>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={() => navigate("/bounties")}>Back to Bounties</button>
    </div>
  );
};

export default Update_Bounties;