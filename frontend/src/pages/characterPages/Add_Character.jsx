import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ADD_CHARACTER } from "../../graphql/mutations";
import { GET_USER_CHARACTERS } from "../../graphql/queries";

const Add_Character = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    age: "",
    gender: "",
    origin: "",
    background: "",
    goal: "",
    weakness: "",
    personality: "",
    powers: "",
    skills: "",
    appearance: "",
  });

  const [addCharacter, { error, data }] = useMutation(ADD_CHARACTER, {
    update: (cache, { data: { addCharacter } }) => {
        const dataInCache = cache.readQuery({ query: GET_USER_CHARACTERS });
        if (dataInCache) {
            cache.writeQuery({ query: GET_USER_CHARACTERS, data: { getUserCharacters: [...dataInCache.getUserCharacters, addCharacter] } });
        }
    },
    onCompleted: () => {
      navigate("/characters");
    },
    onError: (err) => {
      console.error("Error adding character:", err);
    }
  });

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addCharacter({
      variables: {
        name: formData.name,
        nickname: formData.nickname,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        origin: formData.origin,
        background: formData.background,
        goal: formData.goal,
        weakness: formData.weakness,
        personality: formData.personality,
        powers: formData.powers ? formData.powers.split(',').map(p => p.trim()) : [],
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        appearance: formData.appearance,
      },
    });
  };

  return (
    <div>
      <h2>Add Character</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={formData[key]}
            onChange={handleChange}
            required={key === "name"}
          />
        ))}
        <button type="submit">Add Character</button>
      </form>
      {error && <p>Error: {error.message}</p>}
      <button onClick={() => navigate("/characters")}>Go back to characters</button>
    </div>
  );
};

export default Add_Character;

