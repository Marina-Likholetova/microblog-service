const { commentRouter } = require("./comment");
const { postRouter } = require("./post");
const { userRouter } = require("./user");

module.exports = {
    api: {
        userRouter,
        postRouter,
        commentRouter
    }
}