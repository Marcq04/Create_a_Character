import React from 'react';
import { Link } from 'react-router-dom';
import { SubmissionCard, BountyCard } from '../cardLayout/Card';
import './Gallery.css';

export const SubmissionGallery = ({ submissions }) => (
    <div className="submission-gallery">
        {submissions.map(submission => (
            <Link key={submission._id} to={`/submissions/${submission._id}`}>
                <SubmissionCard
                    title={submission.title}
                    description={submission.description}
                    imageUrl={submission.imageUrl}
                    aiTag={submission.aiTag}
                />
            </Link>
        ))}
    </div>
);

export const BountyGallery = ({ bounties }) => (
    <div className="bounty-gallery">
        {bounties.map(bounty => (
            <Link key={bounty._id} to={`/bounties/${bounty._id}`}>
                <BountyCard
                    character={bounty.character}
                    client={bounty.client}
                    description={bounty.description}
                    deadline={bounty.deadline}
                    imageUrl={bounty.imageUrl}
                    aiAllowed={bounty.aiAllowed}
                />
            </Link>
        ))}
    </div>
);

export default { SubmissionGallery, BountyGallery };