import Post from "../models/Post.js";

const resolvers = {
    Query: {
        getPosts: async () => await Post.find(),
        getPost: async (_, { id }) => await Post.findById(id),
    },
    Mutation: {
        createPost: async (_, { title, content }) => {
            const newPost = new Post({ title, content });
            return await newPost.save();
        },
        updatePost: async (_, { id, title, content }) => {
            return await Post.findByIdAndUpdate(id, { title, content }, { new: true });
        },
        deletePost: async (_, { id }) => {
            await Post.findByIdAndDelete(id);
            return "Post deleted";
        },
    },
};

export default resolvers;
