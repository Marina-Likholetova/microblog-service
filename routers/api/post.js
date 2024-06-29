const express = require("express");

const postController = require("../../controllers/api/post_controller");
const { notFoundHandler, businessLogicErrorHandler } = require("../../controllers/api/common");
const { idValidator, postDataValidator } = require("../../middlewares/validators");
const { restrictResource, ROLES } = require("../../middlewares/authContext");

const postRouter = express.Router();

postRouter
    .route("/")
    .get(postController.getAllPosts)
    .post(
        restrictResource([ROLES.admin, ROLES.user]),
        postDataValidator,
        postController.createNewPost,
        businessLogicErrorHandler
    );

postRouter
    .route("/:postId")
    .all(idValidator.postId)
    .get(postController.getPostById)
    .delete(restrictResource([ROLES.admin, ROLES.user]), postController.deletePostById)
    .all(businessLogicErrorHandler);

postRouter.use(notFoundHandler);

module.exports = {
    postRouter,
};