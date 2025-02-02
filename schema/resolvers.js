import User from "../models/User.js";
import Post from "../models/Post.js";


const resolvers = {
    Query: {
        getUsers: async () => {
            const users = await User.find();
            return users;
        },

        getPeopleToFollow: async (_, { id }) => {
            // returns all the people a user doesn't follow
            const users = await User.find({ auth0Id: { $ne: id } })
            return users;
        }
    },
    Mutation: {
        createUser: async (_, { auth0Id, username, email, profilePicture }) => {
            let user = await User.findOne({ auth0Id });

            if (!user) {
                user = new User({ username, email, auth0Id, profilePicture });
                await user.save();
            }

            return user;
        },

        createPost: async (_, { title, content, imageUrl, author }) => {
            const user = await User.findOne({ auth0Id: author });
            if (!user) {
                throw new Error("User not found");
            }
            const post = new Post({ title, content, imageUrl, author });
            await post.save();
            user.posts.push(post._id);
            await user.save();
            return post;
        },

        followUser: async (_, { userId, userToFollowId }) => {
            const user = await User.findById(userId);
            const userToFollow = await User.findById(userToFollowId);

            // push the other user to following of user
            user.following.push(userToFollow);
            // push the user to followers of other user
            userToFollow.followers.push(user);

            await user.save();
            await userToFollow.save();
            return user;
        },

        unfollowUser: async (_, { userId, userTounfollowId }) => {
            const user = await User.findById(userId);
            const userTounfollow = await User.findById(userTounfollowId);

            // pull the other user from the following of user
            user.following.pull(userTounfollow)
            // pull the user from the followers of other user
            userTounfollow.followers.pull(user);

            await user.save();
            await userTounfollow.save();
            return user;
        }
    },
};

export default resolvers;
