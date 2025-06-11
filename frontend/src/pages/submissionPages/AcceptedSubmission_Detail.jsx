import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_SUBMISSION_BY_ID } from "../../graphql/queries";

const AcceptedSubmission_Detail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { loading, error, data } = useQuery(GET_SUBMISSION_BY_ID, {
        variables: { id },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const submission = data.getSubmissionById;

    if (!submission) return <p>Submission not found</p>;

    return (
        <div className="submission-detail-container">
            <h2>Submission by {submission.artist.username}</h2>
            <p>Character: {submission.bounty.character.name}</p>
            <p>Bounty: {submission.bounty.description}</p>
            <img
                src={submission.imageUrl}
                alt="Artwork"
                className="submission-image"
            />
            <button onClick={() => navigate("/home")}>Go Back</button>
        </div>
    );
};

export default AcceptedSubmission_Detail;