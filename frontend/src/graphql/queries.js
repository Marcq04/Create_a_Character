import { gql } from '@apollo/client';

export const GET_BOUNTIES = gql`
  query GetBounties {
    getBounties {
      id
      description
      deadline
      aiAllowed
      isCompleted
      character {
        name
      }
      client {
        username
      }
    }
  }
`;

export const GET_BOUNTY_BY_ID = gql`
  query GetBountyById($id: ID!) {
    getBountyById(id: $id) {
      id
      description
      deadline
      aiAllowed
      character {
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
      client {
        username
      }
    }
  }
`;

export const GET_LEADERBOARD = gql`
  query GetLeaderboard($limit: Int!) {
    getLeaderboard(limit: $limit) {
      id
      username
      honor
      title
    }
  }
`;

export const GET_CHARACTERS = gql`
  query GetCharacters {
    getCharacters {
      id
      name
      nickname
      age
      gender
      origin
    }
  }
`;

export const GET_CHARACTER_BY_ID = gql`
  query GetCharacterById($id: ID!) {
    getCharacterById(id: $id) {
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

export const GET_USER_BOUNTIES = gql`
  query GetUserBounties {
    getUserBounties {
      id
      character {
        name
        nickname
      }
      description
      deadline
      aiAllowed
    }
  }
`;

export const GET_USER_SUBMISSIONS = gql`
  query GetUserSubmissions {
    getUserSubmissions {
      id
      imageUrl
      artist {
        username
      }
    }
  }
`;

export const GET_USER_CHARACTERS = gql`
  query GetUserCharacters {
    getUserCharacters {
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

export const GET_USER_LIKES = gql`
  query GetUserLikes {
    getUserLikes {
      id
      image {
        id
        imageUrl
      }
      createdAt
    }
  }
`;

export const GET_USER_COMMENTS = gql`
  query GetUserComments {
    getUserComments {
      id
      image {
        id
        imageUrl
      }
      content
      createdAt
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      username
      email
      honor
      title
      role
      created_at
      updated_at
      characters {
        id
        name
        appearance
      }
      submissions {
        id
        imageUrl
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      username
      honor
      title
      role
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      username
      honor
      title
      role
      created_at
      updated_at
      characters {
        id
        name
        appearance
      }
      submissions {
        id
        imageUrl
      }
    }
  }
`;

export const GET_SUBMISSIONS_BY_BOUNTY = gql`
  query GetSubmissionsByBounty($bountyId: ID!) {
    getSubmissionsByBounty(bountyId: $bountyId) {
      id
      imageUrl
      artist {
        username
      }
    }
  }
`;

export const GET_ACCEPTED_SUBMISSIONS_BY_BOUNTY = gql`
  query GetAcceptedSubmissionsByBounty($bountyId: ID!) {
    getAcceptedSubmissionsByBounty(bountyId: $bountyId) {
      id
      imageUrl
    }
  }
`;

export const GET_ACCEPTED_SUBMISSIONS = gql`
  query GetAcceptedSubmissions {
    getAcceptedSubmissions {
      id
      imageUrl
    }
  }
`;

export const GET_ACCEPTED_SUBMISSIONS_BY_USER = gql`
  query GetAcceptedSubmissionsByUser($userId: ID!) {
    getAcceptedSubmissionsByUser(userId: $userId) {
      id
      bounty {
        id
        description
        character {
          name
        }
      }
      imageUrl
      isWinner
    }
  }
`;

export const GET_SUBMISSION_BY_ID = gql`
  query GetSubmissionById($id: ID!) {
    getSubmissionById(id: $id) {
      id
      imageUrl
      isWinner
      artist {
        username
      }
      bounty {
        description
        character {
          name
        }
      }
    }
  }
`;

export const GET_USER_IMAGES = gql`
  query GetUserImages {
    getUserImages {
      id
      imageUrl
    }
  }
`;

