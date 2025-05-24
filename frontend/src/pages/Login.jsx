import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LOGIN_USER } from '../graphql/mutations';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.loginUser.token);
      navigate('/home'); // Redirect to home after login
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ variables: formData });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      <button type="submit" disabled={loading}>Log In</button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default Login;

