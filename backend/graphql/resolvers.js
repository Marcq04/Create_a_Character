const Character = require('../models/character');
const User = require('../models/user');
const Bounty = require('../models/bounty');
const Submission = require('../models/submission');
const Like = require('../models/like');
const Comment = require('../models/comment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getTitleByHonor } = require('../utils/titleHelper');
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
                const bounties = await Bounty.find().populate('character client winner');
                return bounties.filter(bounty => bounty.character && bounty.character.name);
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
        },
        getUserById: async (_, { id }) => {
            const user = await User.findById(id).select('_id username honor title role created_at updated_at');
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        },
        getLeaderboard: async (_, { limit = 10 }) => {
            try {
                return await User.find()
                    .sort({ honor: -1 })
                    .limit(limit)
                    .select('_id username honor title role');
            } catch (error) {
                console.error('❌ Failed to fetch leaderboard:', error);
                throw new Error('Failed to fetch leaderboard');
            }
        },
        getAcceptedSubmissionsByUser: async (_, { userId }) => {
            return Submission.find({ artist: userId, isWinner: true });
        },
        getLikes: async (_, { submissionId }) => {
            return Like.find({ submission: submissionId }).populate('user');
        },
        getComments: async (_, { submissionId }) => {
            return Comment.find({ submission: submissionId }).populate('user');
        },
        getUserCharacters: async (_, __, context) => {
            const user = await authMiddleware(context);
            return Character.find({ owner: user._id });
        },
        getUserBounties: async (_, __, context) => {
            const user = await authMiddleware(context);
            const bounties = await Bounty.find({ client: user._id })
                .populate('character')
                .populate('client')
                .populate('winner');

            return bounties.filter(bounty => bounty.character && bounty.character.name);
        },
        getUserSubmissions: async (_, __, context) => {
            const user = await authMiddleware(context);
            return Submission.find({ artist: user._id });
        },
        getUserLikes: async (_, __, context) => {
            const user = await authMiddleware(context);
            return Like.find({ user: user._id }).populate('submission');
        },
        getUserComments: async (_, __, context) => {
            const user = await authMiddleware(context);
            return Comment.find({ user: user._id }).populate('submission');
        },
        getAllUsers: async () => {
            try {
                const users = await User.find().select('_id username honor title role');
                return users;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch users');
            }
        },
        getAcceptedSubmissions: async () => {
            try {
                const submissions = await Submission.find({ isWinner: true }).populate('artist');
                return submissions;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch accepted submissions');
            }
        },
        getSubmissionById: async (_, { id }) => {
            try {
                const submission = await Submission.findById(id)
                    .populate('artist')
                    .populate({
                        path: 'bounty',
                        populate: {
                            path: 'character',
                            select: 'name'
                        }
                    });

                if (!submission) {
                    throw new Error('Submission not found');
                }

                if (!submission.bounty || !submission.bounty.character) {
                    throw new Error('Bounty or character not found');
                }

                return submission;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch submission');
            }
        },
    },

    User: {
        characters: async (parent) => Character.find({ owner: parent._id }),
        submissions: async (parent) => Submission.find({ artist: parent._id, isWinner: true }),
    },

    Mutation: {
        signupUser: async (_, { username, email, password }) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = new User({ username, email, password: hashedPassword, title: getTitleByHonor(0) });
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

                // Find all bounties using this character
                const bounties = await Bounty.find({ character: id });

                for (const bounty of bounties) {
                    // Delete related submissions, likes, and comments
                    const submissions = await Submission.find({ bounty: bounty._id });

                    for (const submission of submissions) {
                        await Like.deleteMany({ submission: submission._id });
                        await Comment.deleteMany({ submission: submission._id });
                        await Submission.findByIdAndDelete(submission._id);
                    }

                    // Delete the bounty itself
                    await Bounty.findByIdAndDelete(bounty._id);
                }

                // Delete the character
                const deletedCharacter = await Character.findByIdAndDelete(id);
                return deletedCharacter;

            } catch (error) {
                console.error(error);
                throw new Error('Failed to delete character');
            }
        },

        createBounty: async (_, { character, description, deadline, aiAllowed }, context) => {
            const user = await authMiddleware(context);

            // Validate character ownership
            const characterDoc = await Character.findById(character);
            if (!characterDoc) throw new Error('Character not found');

            // Auto-delete logic for old completed bounties
            const completedBounties = await Bounty.find({ client: user._id, isCompleted: true })
                .sort({ created_at: 1 }); // oldest first

            if (completedBounties.length >= 3) {
                const bountyToDelete = completedBounties[0];
                await Bounty.findByIdAndDelete(bountyToDelete._id);
                // Optional: also delete submissions tied to that bounty
                await Submission.deleteMany({ bounty: bountyToDelete._id });
            }

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
        },

        submitArt: async (_, { bountyId, imageUrl, publicId }, context) => {
            try {
                const user = await authMiddleware(context);

                const bounty = await Bounty.findById(bountyId);
                if (!bounty || bounty.isCompleted) {
                    throw new Error('Bounty not found or already completed');
                }

                const now = new Date();
                if (bounty.deadline < now) {
                    throw new Error('The deadline for this bounty has passed.');
                }

                const submission = new Submission({
                    bounty: bountyId,
                    artist: user._id,
                    imageUrl,
                    publicId,
                    isWinner: false
                });

                await submission.save();
                return await submission.populate('artist').populate('bounty');
            } catch (err) {
                console.error(err);
                throw new Error(err.message);
            }
        },

        chooseSubmissionWinner: async (_, { bountyId, submissionId }, context) => {
            try {
                const user = await authMiddleware(context);

                const bounty = await Bounty.findById(bountyId);
                if (!bounty) throw new Error('Bounty not found');
                if (bounty.isCompleted) throw new Error('Bounty is already completed');
                if (bounty.client.toString() !== user._id.toString()) throw new Error('Unauthorized');

                const submission = await Submission.findById(submissionId);
                if (!submission) throw new Error('Submission not found');
                if (!submission.bounty.equals(bountyId)) throw new Error('Submission does not match bounty');

                submission.isWinner = true;
                await submission.save();

                bounty.winner = submission._id;
                bounty.isCompleted = true;
                await bounty.save();

                const artist = await User.findById(submission.artist);
                if (artist) {
                    artist.honor += 1;
                    artist.title = getTitleByHonor(artist.honor);
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
                    .populate('character client');
            } catch (err) {
                console.error(" chooseSubmissionWinner error:", err.message);
                throw new Error('Failed to choose winner');
            }
        },

        updateBounty: async (_, { bountyId, description, deadline, aiAllowed }, context) => {
            try {
                const user = await authMiddleware(context);

                const bounty = await Bounty.findById(bountyId);
                if (!bounty) throw new Error('Bounty not found');

                if (bounty.client.toString() !== user._id.toString()) {
                    throw new Error('Unauthorized');
                }

                bounty.description = description;
                bounty.deadline = deadline;
                bounty.aiAllowed = aiAllowed;
                await bounty.save();

                return await Bounty.findById(bounty._id).populate('character client winner');
            } catch (err) {
                console.error(err);
                throw new Error('Failed to update bounty');
            }
        },

        deleteBounty: async (_, { bountyId }, context) => {
            try {
                const user = await authMiddleware(context);

                const bounty = await Bounty.findById(bountyId);
                if (!bounty) throw new Error('Bounty not found');

                if (bounty.client.toString() !== user._id.toString()) {
                    throw new Error('Unauthorized');
                }

                // Get all submissions related to this bounty
                const submissions = await Submission.find({ bounty: bountyId });

                // Delete related likes and comments for each submission
                for (const submission of submissions) {
                    await Like.deleteMany({ submission: submission._id });
                    await Comment.deleteMany({ submission: submission._id });
                    await Submission.findByIdAndDelete(submission._id);
                }

                // Delete the bounty itself
                await Bounty.findByIdAndDelete(bountyId);
                return true;
            } catch (err) {
                console.error(err);
                throw new Error('Failed to delete bounty');
            }
        },

        likeImage: async (_, { imageId }, context) => {
            const user = await authMiddleware(context);

            const alreadyLiked = await Like.findOne({
                user: user._id,
                image: imageId
            }).populate('user');

            if (alreadyLiked) {
                return alreadyLiked;
            }

            const like = new Like({
                user: user._id,
                image: imageId
            });

            await like.save();
            return await Like.findById(like._id).populate('user').populate('image');
        },

        unlikeImage: async (_, { imageId }, context) => {
            const user = await authMiddleware(context);

            const result = await Like.findOneAndDelete({
                user: user._id,
                image: imageId
            }).populate('user').populate('image');

            return !!result;
        },

        addComment: async (_, { imageId, content }, context) => {
            const user = await authMiddleware(context);

            const comment = new Comment({
                user: user._id,
                image: imageId,
                content
            });

            await comment.save();
            return await Comment.findById(comment._id).populate('user').populate('image');
        },

        deleteComment: async (_, { commentId }, context) => {
            try {
                const user = await authMiddleware(context);

                const comment = await Comment.findById(commentId);
                if (!comment) throw new Error('Comment not found');

                if (comment.user.toString() !== user._id.toString()) {
                    throw new Error('Unauthorized');
                }

                await Comment.findByIdAndDelete(commentId);
                return true;
            } catch (err) {
                console.error(err);
                throw new Error('Failed to delete comment');
            }
        },

        uploadImage: async (_, { image }, context) => {
            try {
                const user = await authMiddleware(context);

                const { createReadStream, filename, mimetype } = await image;
                const stream = createReadStream();

                const uploadResult = await uploadStream(stream, filename, mimetype);
                const image = new Image({
                    owner: user._id,
                    publicId: uploadResult.public_id,
                    imageUrl: uploadResult.secure_url
                });

                await image.save();
                return await Image.findById(image._id).populate('owner');
            } catch (err) {
                console.error(err);
                throw new Error('Failed to upload image');
            }
        }
    }
};

module.exports = resolvers;
