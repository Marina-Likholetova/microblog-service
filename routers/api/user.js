const express = require("express");

const userController = require("../../controllers/api/user_controller");
const { notFoundHandler, businessLogicErrorHandler } = require("../../controllers/api/common");
const { idValidator, userDataValidator } = require("../../middlewares/validators");

const userRouter = express.Router();

userRouter
    .route("/")
    .get(userController.getAllUsers)
    .post(
        userDataValidator,
        userController.createNewUser,
        businessLogicErrorHandler
    );

userRouter
    .route("/:userId")
    .all(idValidator.userId)
    .get(userController.getUserById)
    .delete(userController.deleteUserById)
    .all(businessLogicErrorHandler);

userRouter.use(notFoundHandler);

module.exports = {
    userRouter,
};
