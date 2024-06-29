const { NotFoundError } = require("../errors");

function getCommentService(prisma, errorHandler) {
    async function getAllComments() {
        return await prisma.comment.findMany();
    }

    async function getCommentById(id) {
        const commentById = await prisma.comment.findUnique({ where: { id } });

        if (!commentById) throw new NotFoundError({ msg: "Comment not found" });

        return commentById;
    }

    async function createNewComment(data) {
        try {
            return await prisma.comment.create({ data });
        } catch (error) {
            errorHandler(error);
        }
    }

    async function updateComment(id, data) {
        try {
            return await prisma.comment.update({ where: { id }, data });
        } catch (error) {
            errorHandler(error);
        }
    }

    async function deleteCommentById(id) {
        try {
            return await prisma.comment.delete({ where: { id } });
        } catch (error) {
            errorHandler(error);
        }
    }

    return {
        getAllComments,
        getCommentById,
        createNewComment,
        updateComment,
        deleteCommentById
    };
}

module.exports = getCommentService;