const express = require("express");

const postController = require("../../controllers/api/post_controller");
const { notFoundHandler, businessLogicErrorHandler } = require("../../controllers/api/common");

const postRouter = express.Router();

postRouter
    .route("/")
    .get(postController.getAllPosts)
    .post(
        postController.createNewPost,
        businessLogicErrorHandler
    );

postRouter
    .route("/:postId")
    .get(postController.getPostById)
    .delete(postController.deletePostById)
    .all(businessLogicErrorHandler);

postRouter.use(notFoundHandler);

module.exports = {
    postRouter,
};