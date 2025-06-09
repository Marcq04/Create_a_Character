import React from 'react';
import './Card.css';

const BountyCard = ({ character, client, description, deadline, imageUrl, aiAllowed }) => {
  return (
    <div className="card">
      {imageUrl && <img src={imageUrl} alt={character?.name || 'Character Image'} className="card-image" />}
      <div className="card-content">
        <h2 className="card-character">{character?.name || 'Unknown Character'}</h2>
        <p className="card-client">Client: {client?.username || 'Anonymous'}</p>
        <p className="card-description">{description}</p>
        <p className="card-deadline">Deadline: {new Date(deadline).toLocaleDateString()}</p>
        {aiAllowed && <p className="card-ai-allowed">AI Allowed</p>}
      </div>
    </div>
  );
};


const SubmissionCard = ({ title, description, imageUrl, aiTag }) => {
  return (
    <div className="card">
      {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
      <div className="card-content">
        <h2 className="card-">{title}</h2>
        <p className="card-description">{description}</p>
        {aiTag && <p className="card-ai-tag">{aiTag}</p>}
      </div>
    </div>
  );
};


export { BountyCard, SubmissionCard };

