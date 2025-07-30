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

export const ADD_CHARACTER = gql`
  mutation AddCharacter(
    $name: String!
    $nickname: String
    $age: Int
    $gender: String
    $origin: String
    $background: String
    $goal: String
    $weakness: String
    $personality: String
    $powers: [String]
    $skills: [String]
    $appearance: String
  ) {
    addCharacter(
      name: $name
      nickname: $nickname
      age: $age
      gender: $gender
      origin: $origin
      background: $background
      goal: $goal
      weakness: $weakness
      personality: $personality
      powers: $powers
      skills: $skills
      appearance: $appearance
    ) {
      id
      name
      nickname
      age
      gender
      origin
      background
      goal
      weakness
      personality
      powers
      skills
      appearance
    }
  }
`;    

export const UPDATE_CHARACTER = gql`
  mutation UpdateCharacter(
    $id: ID!
    $name: String!
    $nickname: String
    $age: Int
    $gender: String
    $origin: String
    $background: String
    $goal: String
    $weakness: String
    $personality: String
    $powers: [String]
    $skills: [String]
    $appearance: String
  ) {
    updateCharacter(
      id: $id
      name: $name
      nickname: $nickname
      age: $age
      gender: $gender
      origin: $origin
      background: $background
      goal: $goal
      weakness: $weakness
      personality: $personality
      powers: $powers
      skills: $skills
      appearance: $appearance
    ) {
      id
      name
      nickname
      age
      gender
      origin
      background
      goal
      weakness
      personality
      powers
      skills
      appearance
    }
  }
`;

export const DELETE_CHARACTER = gql`
  mutation DeleteCharacter($id: ID!) {
    deleteCharacter(id: $id) {
      id
      name
      nickname
      age
      gender
      origin
      background
      goal
      weakness
      personality
      powers
      skills
      appearance
    }
  }
`;

export const CREATE_BOUNTY = gql`
  mutation CreateBounty(
    $character: ID!
    $description: String
    $deadline: Date!
    $aiAllowed: Boolean!
  ) {
    createBounty(
      character: $character
      description: $description
      deadline: $deadline
      aiAllowed: $aiAllowed
    ) {
      id
      description
      deadline
      aiAllowed
      character {
        id
        name
      }
      client {
        id
        username
      }
    }
  }
`;

export const UPDATE_BOUNTY = gql`
  mutation UpdateBounty(
    $bountyId: ID!
    $description: String
    $deadline: Date!
    $aiAllowed: Boolean!
  ) {
    updateBounty(
      bountyId: $bountyId
      description: $description
      deadline: $deadline
      aiAllowed: $aiAllowed
    ) {
      id
      description
      deadline
      aiAllowed
      isCompleted
      character {
        id
        name
      }
      client {
        id
        username
      }
    }
  }
`;

export const DELETE_BOUNTY = gql`
  mutation DeleteBounty($bountyId: ID!) {
    deleteBounty(bountyId: $bountyId)
  }
`;

export const SUBMIT_ART = gql`
  mutation SubmitArt($bountyId: ID!, $imageUrl: String!, $publicId: String) {
    submitArt(bountyId: $bountyId, imageUrl: $imageUrl, publicId: $publicId) {
      id
      imageUrl
      publicId
      artist {
        username
      }
      submittedAt
    }
  }
`;

export const CHOOSE_WINNER = gql`
  mutation ChooseSubmissionWinner($bountyId: ID!, $submissionId: ID!) {
    chooseSubmissionWinner(bountyId: $bountyId, submissionId: $submissionId) {
      id
      isCompleted
      winner {
        id
        imageUrl
        artist {
          username
        }
      }
    }
  }
`;

export const UPLOAD_IMAGE = gql`
  mutation UploadImage($imageUrl: String!, $publicId: String!, $isProfilePic: Boolean, $isBanner: Boolean) {
    uploadImage(imageUrl: $imageUrl, publicId: $publicId, isProfilePic: $isProfilePic, isBanner: $isBanner) {
      id
      imageUrl
      publicId
      uploadedAt
    }
  }
`;

export const LIKE_IMAGE = gql`
  mutation LikeImage($imageId: ID!) {
    likeImage(imageId: $imageId) {
      id
      likesCount
      likedByUser
    }
  }
`;

export const UNLIKE_IMAGE = gql`
  mutation UnlikeImage($imageId: ID!) {
    unlikeImage(imageId: $imageId) {
      id
      likesCount
      likedByUser
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($imageId: ID!, $text: String!) {
    addComment(imageId: $imageId, text: $text) {
      id
      comments {
        id
        text
        author {
          id
          username
        }
        createdAt
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      id
      comments {
        id
        text
        author {
          id
          username
        }
        createdAt
      }
    }
  }
`;


