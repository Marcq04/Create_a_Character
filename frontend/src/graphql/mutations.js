import { gql } from '@apollo/client';

export const SIGNUP_USER = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;
