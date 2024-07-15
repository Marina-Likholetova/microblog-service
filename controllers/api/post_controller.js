const { StatusCodes } = require("http-status-codes");
const service = require("../../services");
const { withAsyncHandler } = require("../../helpers/withAsyncHandler");

async function getAllPosts(_req, resp) {
    const posts = await service.post.getAllPosts();
    resp.json(posts);
}

async function createNewPost(req, resp) {
    const post = await service.post.createNewPost(req.body);
    resp.status(StatusCodes.CREATED).json(post);
}

async function getPostById(req, resp) {
    const { postId } = req.params;

    const post = await service.post.getPostById(postId);
    resp.json(post);
}

async function getUserPosts(req, resp) {
    const { userId } = req.params;

    const post = await service.getUserPosts(userId);
    resp.json(post);
}

async function deletePostById(req, resp) {
    const { postId } = req.params;

    await service.post.deletePostById(postId);
    resp.status(StatusCodes.NO_CONTENT).send();
}

module.exports = {
    getAllPosts: withAsyncHandler(getAllPosts),
    getPostById: withAsyncHandler(getPostById),
    getUserPosts: withAsyncHandler(getUserPosts),
    createNewPost: withAsyncHandler(createNewPost),
    deletePostById: withAsyncHandler(deletePostById),
};
