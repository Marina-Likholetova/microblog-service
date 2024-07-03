const { PrismaClient } = require("@prisma/client");
const { PrismaClientKnownRequestError, PrismaClientInitializationError } = require("@prisma/client/runtime/library");
const { NotFoundError, ValidationError, AuthError } = require("../errors")

const prisma = new PrismaClient();

const userService = require("./user_service")(prisma, handlePrismaError);
const postService = require("./post_service")(prisma, handlePrismaError);
const commentService = require("./comment_service")(prisma, handlePrismaError)


function handlePrismaError(err) {

    if (!err instanceof PrismaClientKnownRequestError) {
        throw err;
    }

    if (err instanceof PrismaClientInitializationError) {
        throw new Error("PrismaClient error: check database connection");
    }

    if (err.code === "P2025") {
        throw new NotFoundError({ msg: `${err.meta.modelName} not found` });
    } else if (err.code === "P2002") {
        if (err.meta.modelName = "User") throw new AuthError({
            errors: {
                auth: "User already exist"
            }
        });

        throw new ValidationError({ msg: `Duplicate ${err.meta.modelName} entry` });
    } 
}


module.exports = {
    prisma,
    user: userService,
    post: postService,
    comment: commentService,
}