import { gql } from '@apollo/client';

export const GET_BOUNTIES = gql`
  query GetBounties {
    getBounties {
      id
      description
      deadline
      aiAllowed
      character {
        name
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
      }
      client {
        username
      }
    }
  }
`;

export const GET_SUBMISSIONS = gql`
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
      description
      deadline
      aiAllowed
      character {
        name
      }
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
      submission {
        id
        imageUrl
        artist {
          username
        }
      }
    }
  }
`;

export const GET_USER_COMMENTS = gql`
  query GetUserComments {
    getUserComments {
      id
      submission {
        id
        imageUrl
        artist {
          username
        }
      }
    }
  }
`;