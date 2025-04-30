const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './env/.env' });

// MongoDB Atlas Connection
const mongodb_atlas_url = process.env.MONGODB_URL;

// Validate MongoDB Connection
console.log("MongoDB URL:", mongodb_atlas_url);

// Connect to MongoDB
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(mongodb_atlas_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error(`❌ MongoDB Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

// Import GraphQL Schema & Resolvers
const { typeDefs } = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const startServer = async () => {
    // Define Express Server
    const app = express();
    app.use(express.json());
    app.use(cors()); 

    const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req }) });
    await server.start();

    // Add Express app as middleware to Apollo Server
    server.applyMiddleware({ app }); 

    // Connect to MongoDB first, then start the server
    await connectDB();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
};

// Start the server
startServer();