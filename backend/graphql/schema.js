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

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        me: User
        getCharacters: [Character]
        getCharacterById(id: ID!): Character
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
    }
`;

module.exports = { typeDefs };

