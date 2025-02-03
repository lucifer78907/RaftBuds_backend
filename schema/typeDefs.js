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

    type FeedResponse {
        posts: [Post!]!
        nextCursor: String
    }

    type Query {
        getUsers: [User]
        getUser(userId:ID!):User,
        getUserPosts(userId:ID!): [Post],
        getFollowingList(id:ID!): [User]
        getFollowersList(id:ID!): [User]
        getPeopleToFollow(id:String!): [User]
        getFeed(userId:ID!):[Post],
        getFeedWithCursor(userId: ID!, cursor: String, limit: Int = 1): FeedResponse!
    }

    type Mutation {
        createUser(username: String!, email: String!,auth0Id:String!,profilePicture:String): User
        followUser(userId:ID!,userToFollowId:ID!):User,
        unfollowUser(userId:ID!,userTounfollowId:ID!):User,
        createPost(title: String!, content: String!, imageUrl: String!, author: ID!,tags:[ID!]): Post
    }

`;

export default typeDefs;
