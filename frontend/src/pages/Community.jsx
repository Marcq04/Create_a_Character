import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';

const Community = () => {
    const { data, loading, error } = useQuery(GET_ALL_USERS);
    const navigate = useNavigate();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { getAllUsers } = data;

    return (
        <div>
            <h2>Community</h2>
            <ul>
                {getAllUsers.map((user) => (
                    <li key={user.id}>
                        <button type="button" onClick={() => navigate(`/profile/${user.id}`)}>
                            {user.username} - {user.title} ({user.honor})
                        </button>
                    </li>
                ))}
            </ul>
            <button type="button" onClick={() => navigate('/home')}>Go Back to Home</button>
        </div>
    );
}

export default Community;

