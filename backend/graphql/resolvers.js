const Character = require('../models/character');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GraphQLScalarType, Kind } = require('graphql');

// Middleware to check if the user is authenticated
const authMiddleware = async (context) => {
    const authHeader = context.req.headers.authorization;
    console.log("Received Token:", authHeader);

    if (!authHeader) throw new Error("Authentication required");

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) throw new Error("User not found");
        return user;
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};

const dataScaler = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        return value.toISOString();
    },
    parseValue(value) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    }
});

const resolvers = {
    Date: dataScaler,
    
    Query: {
        me: async (_, __, context) => {
            const user = await authMiddleware(context);
            return user;
        },
        getCharacters: async () => {
            try {
                const characters = await Character.find();
                return characters;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch characters');
            }
        },
        getCharacterById: async (_, { id }) => {
            try {
                const character = await Character.findById(id);
                if (!character) {
                    throw new Error('Character not found');
                }
                return character;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch character');
            }
        }
    },
    Mutation: {
        signupUser: async (_, { username, email, password }) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = new User({ username, email, password: hashedPassword });
                await user.save();
                const token = jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );
                return { token, user };
            } catch (error) {
                console.error(error);
                throw new Error('Failed to create user');
            }   
        },               

        loginUser: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error('User not found');
                }
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }
                const token = jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' } 
                );
                return { token, user };
            } catch (error) {
                console.error(error);
                throw new Error('Failed to login user');
            }
        },               

        addCharacter: async (_, { name, nickname, age, gender, origin, background, goal, weakness, personality, powers, skills, appearance }, context) => {
            try {
                const user = await authMiddleware(context);
                const character = new Character({ name, nickname, age, gender, origin, background, goal, weakness, personality, powers, skills, appearance, owner: user._id });
                await character.save();
                return character;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to add character');
            }
        },

        updateCharacter: async (_, { id, ...updates }, context) => {
            try {
                const user = await authMiddleware(context);
        
                const character = await Character.findById(id);
                if (!character) {
                    throw new Error('Character not found');
                }
                if (character.owner.toString() !== user._id.toString()) {
                    throw new Error('Unauthorized');
                }
        
                // Update only the fields that are actually provided
                Object.keys(updates).forEach(key => {
                    if (updates[key] !== undefined) {
                        character[key] = updates[key];
                    }
                });
        
                character.updated_at = new Date(); // Update the timestamp
        
                await character.save();
                return character;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to update character');
            }
        },        

        deleteCharacter: async (_, { id }, context) => {
            try {
                const user = await authMiddleware(context);
                const character = await Character.findById(id);
                if (!character) {
                    throw new Error('Character not found');
                }
                if (character.owner.toString() !== user._id.toString()) {
                    throw new Error('Unauthorized');
                }
                
                const deletedCharacter = await Character.findByIdAndDelete(id);
                return deletedCharacter;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to delete character');
            }
        }
        
    }
};

module.exports = resolvers;