import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { GET_BOUNTY_BY_ID } from "../../graphql/queries";
import { SUBMIT_ART } from "../../graphql/mutations";

const Bounty_Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loading, error, data } = useQuery(GET_BOUNTY_BY_ID, {
        variables: { id },
    });
    const [imageUrl, setImageUrl] = useState('');
    const [publicId, setPublicId] = useState('');
    const [submitArt] = useMutation(SUBMIT_ART, {
        onCompleted: () => {
            alert('Art submitted successfully!');
            setImageUrl('');
            setPublicId('');
            navigate('/home');
        },
        onError: (error) => alert(`Error: ${error.message}`),
    });

    const isValidImageUrl = (url) => {
        return /\.(jpg|jpeg|png|gif)$/.test(url);
    };

    const openUploadWidget = () => {
        const widget = window.cloudinary.createUploadWidget({
            cloudName: 'dpbsmirhv',
            uploadPreset: 'create-a-character',
            folder: 'submissions',
            sources: ['local', 'url'],
            showAdvancedOptions: false,
            cropping: true,
            multiple: false,
        }, (error, result) => {
            if (result && result.event === 'success') {
                setImageUrl(result.info.secure_url);
                setPublicId(result.info.public_id);
            }
        });
        widget.open();
    };

    const handleSubmitArt = () => {
        if (imageUrl) {
            submitArt({
                variables: {
                    bountyId: id,
                    imageUrl,
                    publicId,
                },
            });
        } else {
            alert('Please upload an image.');
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const bounty = data.getBountyById;
    const isPastDeadline = new Date() > new Date(bounty.deadline);

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
            <button onClick={() => navigate('/home')}>Go Back</button>
            <h3>Submit Artwork</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmitArt();
            }}>
                <p style={{color: 'red'}}>Please watermark your artwork before submitting!</p>
                {isPastDeadline && <p style={{color: 'red'}}>The deadline for this bounty has passed.</p>}
                <input
                    type="text"
                    placeholder="Artwork Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                    disabled={isPastDeadline}
                />
                <button type="submit" disabled={isPastDeadline}>Submit</button>
                <button type="button" onClick={openUploadWidget} disabled={isPastDeadline}>Upload Image</button>
            </form>
            {imageUrl && <img src={imageUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />}
        </div>
    );
};

export default Bounty_Details;

