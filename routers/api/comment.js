const express = require("express");

const commentController = require("../../controllers/api/comment_controller");
const { notFoundHandler, businessLogicErrorHandler } = require("../../controllers/api/common");
const { idValidator, commentDataValidator } = require("../../middlewares/validators");

const commentRouter = express.Router();

commentRouter
    .route("/")
    .get(commentController.getAllComments)
    .post(
        commentDataValidator,
        commentController.createNewComment,
        businessLogicErrorHandler
    );

commentRouter
    .route("/:commentId")
    .all(idValidator.commentId)
    .get(commentController.getCommentById)
    .delete(commentController.deleteCommentById)
    .all(businessLogicErrorHandler);

commentRouter.use(notFoundHandler);

module.exports = {
    commentRouter,
};