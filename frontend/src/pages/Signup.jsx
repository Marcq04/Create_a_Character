import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SIGNUP_USER } from '../graphql/mutations';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [signupUser, { loading, error }] = useMutation(SIGNUP_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.signupUser.token);
      navigate('/login'); // Redirect to login after signup
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signupUser({ variables: formData });
  };

  const handleLoginRoute = () => {
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
      <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      <button type="submit" disabled={loading}>Sign Up</button>
      {error && <p>Error: {error.message}</p>}
      <button type="button" onClick={handleLoginRoute}>Already have an account? Login</button>
    </form>
  );
};

export default Signup;

