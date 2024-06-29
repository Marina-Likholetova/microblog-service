const express = require("express");

const commentController = require("../../controllers/api/comment_controller");
const { notFoundHandler, businessLogicErrorHandler } = require("../../controllers/api/common");

const commentRouter = express.Router();

commentRouter
    .route("/")
    .get(commentController.getAllComments)
    .post(
        commentController.createNewComment,
        businessLogicErrorHandler
    );

commentRouter
    .route("/:commentId")
    .get(commentController.getCommentById)
    .delete(commentController.deleteCommentById)
    .all(businessLogicErrorHandler);

commentRouter.use(notFoundHandler);

module.exports = {
    commentRouter,
};