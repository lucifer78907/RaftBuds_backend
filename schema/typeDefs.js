import gql from "graphql-tag";

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        profilePicture: String
        auth0Id:String!
        posts: [Post]
        followers: [User]
        following: [User]
        createdAt: String!
        updatedAt: String!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        imageUrl: String
        author: User!
        mentions: [User]
    }

    type Query {
        getUsers: [User]
        getUser(id: ID!): User
        getPosts: [Post]
        getPost(id: ID!): Post
    }

    type Mutation {
        createUser(username: String!, email: String!,auth0Id:String!,profilePicture:String): User
    }

`;

export default typeDefs;
