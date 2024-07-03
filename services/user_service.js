const { NotFoundError } = require("../errors");

function getUserService(prisma, errorHandler) {
    async function getAllUsers() {
        try {
            return await prisma.user.findMany({
                include: {
                    posts: { select: { id: true } },
                    comments: { select: { id: true } },
                },
            });
        } catch (error) {
            errorHandler(error);
        }
    }

    async function getUserByName(username) {
        try {
            return await prisma.user.findUnique({
                where: { username },
            });
        } catch (error) {
            errorHandler(error);
        }
    }

    async function getUserById(id) {
        const userById = await prisma.user.findUnique({
            where: { id },
            include: {
                posts: true,
                comments: true,
            },
        });

        if (!userById) throw new NotFoundError({ msg: `User by ${id} not found` });

        return userById;
    }

    async function createNewUser(data) {
        try {
            return await prisma.user.create({ data });
        } catch (error) {
            errorHandler(error);
        }
    }

    async function updateUser(id, data) {
        try {
            return await prisma.user.update({ where: { id }, data });
        } catch (error) {
            errorHandler(error);
        }
    }

    async function deleteUserById(id) {
        try {
            return await prisma.$transaction(async (tx) => {
                await tx.comment.deleteMany({
                    where: { authorId: id },
                });

                await tx.post.deleteMany({
                    where: { authorId: id },
                });

                const user = await tx.user.delete({
                    where: { id },
                });

                return user;
            });
        } catch (error) {
            errorHandler(error);
        }
    }

    return { getAllUsers, getUserByName, getUserById, createNewUser, updateUser, deleteUserById };
}

module.exports = getUserService;
