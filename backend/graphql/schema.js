const { gql } = require('apollo-server-express');

const typeDefs = gql`
    scalar Date

    type User {
        id: ID!
        username: String!
        email: String!
        honor: Int!
        role: String!
        created_at: Date!
        updated_at: Date!
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
        isWinner: Boolean!
        submittedAt: Date!
    }


    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        me: User
        getCharacters: [Character]
        getCharacterById(id: ID!): Character

        getBounties: [Bounty]
        getBountyById(id: ID!): Bounty
        getSubmissionsByBounty(bountyId: ID!): [Submission]
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
        ): Submission

        chooseSubmissionWinner(
            bountyId: ID!,
            submissionId: ID!
        ): Bounty
    }
`;

module.exports = { typeDefs };

