import User from "../models/User.js";
import Post from "../models/Post.js";


const resolvers = {
    Query: {
        getFeed: async (_, { userId }) => {
            const user = await User.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            const followingIds = user.following;
            // get me all those posts where author of post is in the following of user
            // or get all the post where userId is tagged
            const posts = await Post.find({ $or: [{ author: { $in: followingIds } }, { mentions: userId }] }).sort({ createdAt: -1 })
            return posts;
        },

        getFollowingList: async (_, { id }) => {
            const user = await User.findById(id).populate('following');
            if (!user) {
                throw new Error('User not found');
            }
            return user.following;
        },

        getFollowersList: async (_, { id }) => {
            const user = await User.findById(id).populate('followers');
            if (!user) {
                throw new Error('User not found');
            }
            return user.followers;
        },

        getUser: async (_, { userId }) => {
            const user = await User.findById(userId);
            return user;
        },

        getUsers: async () => {
            const users = await User.find();
            return users;
        },

        getPeopleToFollow: async (_, { id }) => {
            // returns all the people a user doesn't follow
            const user = await User.findById(id);
            // find all the users expect the user itself and the user NOT IN his following
            const users = await User.find({ $and: [{ _id: { $ne: id } }, { _id: { $nin: user.following } }] })
            return users;
        },

        getUserPosts: async (_, { userId }) => {
            const user = await User.findById(userId).populate('posts')
            return user.posts;
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

        createPost: async (_, { title, content, imageUrl, author, tags }) => {
            const user = await User.findById(author);
            if (!user) {
                throw new Error("User not found");
            }
            const post = new Post({ title, content, imageUrl, author, mentions: tags });
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

    Post: {
        author: async (post) => {
            const user = await User.findById(post.author);
            return user;
        },

        mentions: async (post) => {
            const users = await User.find({ _id: { $in: post.mentions } });
            return users;
        }
    },

    User: {
        followers: async (user) => {
            const userProfile = await User.findById(user.id).populate('followers');
            return userProfile.followers;
        },
        following: async (user) => {
            const userProfile = await User.findById(user.id).populate('following');
            return userProfile.following;
        }
    }
};

export default resolvers;
