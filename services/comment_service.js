const { NotFoundError } = require("../errors");

function getCommentService(prisma, errorHandler) {
    async function getAllComments() {
        try {
            return await prisma.comment.findMany();
        } catch (error) {
            errorHandler(error);
        }
    }

    async function getCommentById(id) {
        try {
            const commentById = await prisma.comment.findUnique({ where: { id } });

            if (!commentById) throw new NotFoundError({ msg: `Comment by ${id} not found` });

            return commentById;
        } catch (error) {
            errorHandler(error);
        }
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
        deleteCommentById,
    };
}

module.exports = getCommentService;
