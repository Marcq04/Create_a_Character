import { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { GET_BOUNTY_BY_ID, GET_SUBMISSIONS_BY_BOUNTY } from "../../graphql/queries";
import { CHOOSE_WINNER } from "../../graphql/mutations";
import "./Submission.css";

const User_Bounty_Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        loading: loadingBounty,
        error: errorBounty,
        data: bountyData
    } = useQuery(GET_BOUNTY_BY_ID, {
        variables: { id },
    });

    const {
        loading: loadingSubmissions,
        error: errorSubmissions,
        data: submissionData
    } = useQuery(GET_SUBMISSIONS_BY_BOUNTY, {
        variables: { bountyId: id },
    });

    const [chooseWinner] = useMutation(CHOOSE_WINNER);

    if (loadingBounty || loadingSubmissions) return <p>Loading...</p>;
    if (errorBounty || errorSubmissions) return <p>Error loading bounty</p>;

    const bounty = bountyData.getBountyById;
    const submissions = submissionData.getSubmissionsByBounty;

    const handleChooseWinner = async (submissionId) => {
        if (bounty.isCompleted) {
            alert("You have already chosen a winner for this bounty!");
            return;
        }
        console.log('Choosing winner with:', { bountyId: id, submissionId });
        try {
            await chooseWinner({ variables: { bountyId: id, submissionId } });
            navigate("/bounties");
        } catch (error) {
            console.error('Frontend error:', error);
        }
    };


    return (
        <div>
            <h2>
                {bounty.character.name} ({bounty.character.nickname})
            </h2>
            <p>Client: {bounty.client.username}</p>
            <p>Description: {bounty.description}</p>
            <p>Deadline: {bounty.deadline}</p>
            <p>AI Allowed: {bounty.aiAllowed ? "Yes" : "No"}</p>
            <p>Age: {bounty.character.age}</p>
            <p>Gender: {bounty.character.gender}</p>
            <p>Origin: {bounty.character.origin}</p>
            <p>Background: {bounty.character.background}</p>
            <p>Goal: {bounty.character.goal}</p>
            <p>Weakness: {bounty.character.weakness}</p>
            <p>Personality: {bounty.character.personality}</p>
            <p>Powers: {bounty.character.powers?.join(', ')}</p>
            <p>Skills: {bounty.character.skills?.join(', ')}</p>
            <p>Appearance: {bounty.character.appearance}</p>
            <button onClick={() => navigate('/bounties')}>Go Back</button>
            <h3>Submissions</h3>
            <ul className="submissions-list">
                {submissions.map((submission) => (
                    <li key={submission.id} className="submission-item">
                        <img
                            src={submission.imageUrl}
                            alt={`${bounty.character.name} submission by ${submission.artist.username}`}
                            className="submission-image"
                        />
                        <p>Artist: {submission.artist.username}</p>
                        <button
                            onClick={() => handleChooseWinner(submission.id)}
                            disabled={bounty.isCompleted}
                        >
                            {bounty.isCompleted ? "Already completed" : "Choose as Winner"}
                        </button>
                    </li>
                ))}
            </ul>
            {bounty.isCompleted && <p>You have already chosen a winner for this bounty!</p>}
        </div>
    );
};
export default User_Bounty_Details;

