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