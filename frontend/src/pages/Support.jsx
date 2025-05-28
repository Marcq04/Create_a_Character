import React from 'react';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const navigate = useNavigate();
  const goBackToHome = () => {
    navigate('/home');
  };

  return (
    <div>
      <h1>Support</h1>
      <p>If you need any help, please contact us at <a href="mailto:support@create-a-character.com">support@create-a-character.com</a>.</p>
      <h2>Admins</h2>
      <p>For any inquiries related to admin access, please contact one of the following admins: <a href="mailto:admin@create-a-character.com">admin@create-a-character.com</a></p>
      <button onClick={goBackToHome}>Go Back to Home</button>
    </div>
  );
};

export default Support;

