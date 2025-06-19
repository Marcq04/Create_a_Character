import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { ME } from '../../graphql/queries';
import { UPLOAD_IMAGE } from '../../graphql/mutations';
import './Profile.css';

const Profile = () => {
  const { data, loading, error } = useQuery(ME);
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { me: user } = data;

  const [imageUrl, setImageUrl] = useState('');
  const [publicId, setPublicId] = useState('');
  const [uploadImage] = useMutation(UPLOAD_IMAGE, {
    onCompleted: () => {
      alert('Image uploaded successfully!');
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const openUploadWidget = () => {
    const widget = window.cloudinary.createUploadWidget({
      cloudName: 'dpbsmirhv',
      uploadPreset: 'create-a-character',
      folder: 'profileImages',
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

  const handleImageUpload = () => {
    if (imageUrl) {
      uploadImage({ variables: { imageUrl, publicId } });
    }
    else {
      alert('Please upload an image.');
    }
  };

  return (
    <div className="profile">
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Honor: {user.honor}</p>
      <p>Title: {user.title}</p>
      <p>Role: {user.role}</p>

      <h3>Characters</h3>
      <ul>
        {user.characters.length > 0 ? (
          user.characters.map(character => (
            <li key={character.id}>
              <Link to={`/characters/${character.id}`}>
                <p>{character.name}</p>
              </Link>
            </li>
          ))
        ) : (
          <p>No characters found.</p>
        )}
      </ul>

      <button onClick={() => navigate('/home')}>Go Back to Home</button>
    </div>
  );
};

export default Profile;

