const { StatusCodes } = require("http-status-codes");
const service = require("../../services");

const withAsyncHandler = (fn) => async (req, resp, next) => {
    try {
        await fn(req, resp, next);
    } catch (err) {
        next(err);
    }
};

async function getAllComments(_req, resp) {
    const comments = await service.comment.getAllComments();
    resp.json(comments);
}

async function createNewComment(req, resp) {
    const comment = await service.comment.createNewComment(req.body);
    resp.status(StatusCodes.CREATED).json(comment);
}

async function getCommentById(req, resp) {
    const { commentId } = req.params;

    const comment = await service.comment.getCommentById(commentId);
    resp.json(comment);
}

async function deleteCommentById(req, resp) {
    const { commentId } = req.params;

    await service.comment.deleteCommentById(commentId);
    resp.status(StatusCodes.NO_CONTENT).json();
}

module.exports = {
    getAllComments: withAsyncHandler(getAllComments),
    getCommentById: withAsyncHandler(getCommentById),
    createNewComment: withAsyncHandler(createNewComment),
    deleteCommentById: withAsyncHandler(deleteCommentById),
};
