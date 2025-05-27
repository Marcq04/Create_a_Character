import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_USER_CHARACTERS } from '../../graphql/queries';
import { DELETE_CHARACTER } from '../../graphql/mutations';

const Characters = () => {
    const { loading, data, refetch } = useQuery(GET_USER_CHARACTERS);
    const [deleteCharacter] = useMutation(DELETE_CHARACTER);
    const navigate = useNavigate();

    if (loading) return <p>Loading...</p>;

    if (!data || !data.getUserCharacters) return <p>No characters found</p>;

    const handleDelete = async (characterId) => {
        if (window.confirm('Are you sure you want to delete this character?')) {
            try {
                await deleteCharacter({ variables: { id: characterId } });
                await refetch();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div>
            <h2>Characters</h2>
            <div>
                <button type="button" onClick={() => navigate('/add_character')}>
                    Add Character
                </button>
                <button type="button" onClick={() => navigate('/home')}>
                    Go back to home
                </button>
            </div>
            <ul>
                {data.getUserCharacters.map((character) => (
                    <li key={character.id}>
                        <button
                            type="button"
                            onClick={() => navigate(`/characters/${character.id}`)}
                        >
                            {character.name}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/update_character/${character.id}`)}
                        >
                            Update
                        </button>
                        <button type="button" onClick={() => handleDelete(character.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Characters;

