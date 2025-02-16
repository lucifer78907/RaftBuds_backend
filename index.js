import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';


dotenv.config();

const app = express();
// app.use(cors());
app.use(cors({
    origin: 'https://raftbuds.web.app', // Replace with your frontend's origin
}));
app.use(express.json());

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();
    app.use('/graphql', expressMiddleware(server));


    mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
    }).then(() => {
        console.log('MongoDB connected');
    }).catch((err) => {
        console.log(err);
    });

    app.listen({ port: process.env.PORT }, () => {
        console.log(`Server running at http://localhost:${process.env.PORT}/graphql`);
    });
}

app.use((err, req, res, next) => {
    console.error(err.message); // Log only the error message
    res.status(500).send(err.message); // Send only the error message in the response
});

startServer();