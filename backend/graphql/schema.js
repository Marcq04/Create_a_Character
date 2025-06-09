const { gql } = require('apollo-server-express');

const typeDefs = gql`
    scalar Date

    type User {
        id: ID!
        username: String!
        email: String!
        honor: Int!
        title: String!
        role: String!
        created_at: Date!
        updated_at: Date!
        characters: [Character]
        submissions: [Submission]
    }

    type Character {
        id: ID!
        owner: ID! 
        name: String!
        nickname: String
        age: Int
        gender: String
        origin: String
        background: String
        goal: String
        weakness: String
        personality: String
        powers: [String]
        skills: [String]
        appearance: String
        created_at: Date!
        updated_at: Date!
    }

    type Bounty {
        id: ID!
        character: Character!
        client: User!
        description: String
        deadline: Date!
        aiAllowed: Boolean!
        isCompleted: Boolean!
        winner: Submission
        created_at: Date!
        updated_at: Date!
    }

    type Submission {
        id: ID!
        bounty: Bounty!
        artist: User!
        imageUrl: String!
        publicId: String
        isWinner: Boolean!
        submittedAt: Date!
    }

    type Like {
        id: ID!
        user: User!
        submission: Submission!
        createdAt: Date!
    }

    type Comment {
        id: ID!
        user: User!
        submission: Submission!
        content: String!
        createdAt: Date!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        me: User
        getAllUsers: [User]
        getCharacters: [Character]
        getCharacterById(id: ID!): Character

        getBounties: [Bounty]
        getBountyById(id: ID!): Bounty
        getSubmissionsByBounty(bountyId: ID!): [Submission]
        getLeaderboard(limit: Int): [User]
        getUserById(id: ID!): User
        getAcceptedSubmissionsByUser(userId: ID!): [Submission]
        getLikes(submissionId: ID!): [Like]
        getComments(submissionId: ID!): [Comment]
        getUserCharacters: [Character]
        getUserBounties: [Bounty]
        getUserSubmissions: [Submission]
        getUserLikes: [Like]
        getUserComments: [Comment]
        getAcceptedSubmissions: [Submission]
    }

    type Mutation {
        signupUser(username: String!, email: String!, password: String!): AuthPayload!
        loginUser(email: String!, password: String!): AuthPayload!

        addCharacter(
            name: String!,
            nickname: String,
            age: Int,
            gender: String,
            origin: String,
            background: String,
            goal: String,
            weakness: String,
            personality: String,
            powers: [String],
            skills: [String],
            appearance: String
        ): Character
        updateCharacter(
            id: ID!,
            name: String!,
            nickname: String,
            age: Int,
            gender: String,
            origin: String,
            background: String,
            goal: String,
            weakness: String,
            personality: String,
            powers: [String],
            skills: [String],
            appearance: String
        ): Character
        deleteCharacter(id: ID!): Character

        createBounty(
            character: ID!,
            description: String,
            deadline: Date!,
            aiAllowed: Boolean!
        ): Bounty

        submitArt(
            bountyId: ID!,
            imageUrl: String!
            publicId: String
        ): Submission

        chooseSubmissionWinner(
            bountyId: ID!,
            submissionId: ID!
        ): Bounty

        updateBounty(
            bountyId: ID!,
            description: String,
            deadline: Date!,
            aiAllowed: Boolean!
        ): Bounty

        deleteBounty(bountyId: ID!): Boolean

        likeSubmission(submissionId: ID!): Like
        unlikeSubmission(submissionId: ID!): Boolean
        addComment(submissionId: ID!, content: String!): Comment
        deleteComment(commentId: ID!): Boolean
    }
`;

module.exports = { typeDefs };
