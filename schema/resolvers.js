import User from "../models/User.js";


const resolvers = {
    Query: {
        getUsers: async () => {
            const users = await User.find();
            return users;
        },
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
    },
};

export default resolvers;
