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
        imageUrl: String!
        author: User!
        mentions: [User]
    }

    type Query {
        getUsers: [User]
        getFollowingList(id:ID!): [User]
        getPeopleToFollow(id:String!): [User]
        getFeed(userId:ID!):[Post],
    }

    type Mutation {
        createUser(username: String!, email: String!,auth0Id:String!,profilePicture:String): User
        followUser(userId:ID!,userToFollowId:ID!):User,
        unfollowUser(userId:ID!,userTounfollowId:ID!):User,
        createPost(title: String!, content: String!, imageUrl: String!, author: ID!,tags:[ID!]): Post
    }

`;

export default typeDefs;
