const Character = require('../models/character');
const User = require('../models/user');
const Bounty = require('../models/bounty');
const Submission = require('../models/submission');
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
        },
        getBounties: async () => {
            try {
                return await Bounty.find().populate('character client winner');
            } catch (err) {
                console.error(err);
                throw new Error('Failed to fetch bounties');
            }
        },
        
        getBountyById: async (_, { id }) => {
            try {
                return await Bounty.findById(id).populate('character client winner');
            } catch (err) {
                console.error(err);
                throw new Error('Failed to fetch bounty');
            }
        },
        
        getSubmissionsByBounty: async (_, { bountyId }) => {
            try {
                return await Submission.find({ bounty: bountyId }).populate('artist');
            } catch (err) {
                console.error(err);
                throw new Error('Failed to fetch submissions');
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
                    if (Object.prototype.hasOwnProperty.call(updates, key)) {
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
        },

        createBounty: async (_, { character, description, deadline, aiAllowed }, context) => {
            try {
                const user = await authMiddleware(context);
        
                // Check if character exists
                const characterDoc = await Character.findById(character);
                if (!characterDoc) throw new Error('Character not found');
        
                const bounty = new Bounty({
                    character,
                    client: user._id,
                    description,
                    deadline,
                    aiAllowed,
                    isCompleted: false
                });
        
                await bounty.save();
                return await Bounty.findById(bounty._id).populate('character client winner');
            } catch (err) {
                console.error(err);
                throw new Error('Failed to create bounty');
            }
        },        
        
        submitArt: async (_, { bountyId, imageUrl }, context) => {
            try {
                const user = await authMiddleware(context);
        
                const bounty = await Bounty.findById(bountyId);
                if (!bounty || bounty.isCompleted) {
                    throw new Error('Bounty not found or already completed');
                }
        
                const submission = new Submission({
                    bounty: bountyId,
                    artist: user._id,
                    imageUrl,
                    isWinner: false
                });
        
                await submission.save();
                return await Submission.findById(submission._id)
                    .populate({
                        path: 'bounty',
                        select: '_id description',
                    })
                    .populate({
                        path: 'artist',
                        select: '_id username',
                    });
            } catch (err) {
                console.error(err);
                throw new Error('Failed to submit art');
            }
        },
        
        chooseSubmissionWinner: async (_, { bountyId, submissionId }, context) => {
            try {
                const user = await authMiddleware(context);
        
                const bounty = await Bounty.findById(bountyId);
                if (!bounty) throw new Error('Bounty not found');
        
                // Check if bounty is already completed
                if (bounty.isCompleted) {
                    throw new Error('Bounty is already completed');
                }
        
                if (bounty.client.toString() !== user._id.toString()) {
                    throw new Error('Unauthorized');
                }
        
                const submission = await Submission.findById(submissionId);
                if (!submission || submission.bounty.toString() !== bountyId) {
                    throw new Error('Submission not found or does not match bounty');
                }
        
                submission.isWinner = true;
                await submission.save();
        
                bounty.winner = submission._id;
                bounty.isCompleted = true;
                await bounty.save();
        
                // Add honor point to the winning artist
                const artist = await User.findById(submission.artist);
                if (artist) {
                    artist.honor += 1;
                    await artist.save();
                }
        
                return await Bounty.findById(bounty._id)
                    .populate({
                        path: 'winner',
                        populate: {
                            path: 'artist',
                            select: '_id username'
                        }
                    })
                    .populate('character client'); // Optional extras
            } catch (err) {
                console.error(err);
                throw new Error('Failed to choose winner');
            }
        }         
    }
};

module.exports = resolvers;