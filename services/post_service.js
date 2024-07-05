const { NotFoundError } = require("../errors");

const postPrismaOptions = {
    orderOptions: {
        orderBy: [
            {
                createdAt: "desc",
            }
        ],
    },
    includeOptions: {
        include: { author: true, comments: { include: { author: true } }, media: true }
    }
};

function getPostService(prisma, errorHandler) {
    async function getAllPosts() {
        try {
            return await prisma.post.findMany({
                ...postPrismaOptions.orderOptions,
                ...postPrismaOptions.includeOptions
            });
        } catch (error) {
            errorHandler(error)
        }
    }

    async function getPostById(id) {
        const postById = await prisma.post.findUnique({
            where: { id },
            ...postPrismaOptions.includeOptions,
        });

        if (!postById) throw new NotFoundError({ msg: `Post by ${id} not found` });

        return postById;
    }

    async function getUserPosts(userId) {
      try {
          return await prisma.post.findMany({
              where: { authorId: userId },
              ...postPrismaOptions.orderOptions,
              ...postPrismaOptions.includeOptions
          });
      } catch (error) {
          errorHandler(error);
      }
    }

    async function createNewPost(data) {
        try {
            return await prisma.$transaction(async (tx) => {
                const postData = { ...data };

                delete postData.media;

                const post = await prisma.post.create({ data: postData });
                
                if (data.media) {
                    await prisma.media.create({ data: { ...data.media, postId: post.id }})
                }

                return post
            })
        } catch (error) {
            errorHandler(error);
        }
    }

    async function updatePost(id, data) {
        try {
            return await prisma.post.update({ where: { id }, data });
        } catch (error) {
            errorHandler(error);
        }
    }

    async function deletePostById(id) {
        try {
            return await prisma.$transaction(async (tx) => {
                await tx.media.deleteMany({
                    where: { postId: id }
                })

                await tx.comment.deleteMany({
                    where: { postId: id },
                });

                const post = await tx.post.delete({
                    where: { id },
                });

                return post
            });
        } catch (error) {
            errorHandler(error);
        }
    }

    return { getAllPosts, getUserPosts, getPostById, createNewPost, updatePost, deletePostById };
}

module.exports = getPostService;