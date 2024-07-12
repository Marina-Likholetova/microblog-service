const { commentRouter } = require("./comment");
const { postRouter } = require("./post");
const { userRouter } = require("./user");

module.exports = {
    userRouter,
    postRouter,
    commentRouter
}