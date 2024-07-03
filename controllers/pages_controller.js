const { AuthError } = require("../errors");
const service = require("../services");
const logger = require("../utils/logger")("pages controller");

function addPageContext(req, _resp, next) {
    const { context = {} } = req.session || {};
    const role = context.role || "unauthorized";
    const username = context.username || "anonymous";

    req.__pageContext = {
        isLoggedIn: !!context?.role,
        role,
        username,
        ...context,
    };

    logger.info(`Page context for [${role}] - [${username}] added!`);

    next();
}

function checkAuth(req, _resp, next) {
    try {
        const { userId, isLoggedIn } = req.__pageContext;

        if (!userId || !isLoggedIn) throw new AuthError({ msg: "No authorized user found" });

        next();
    } catch (error) {
        next(error);
    }
}

function renderPage(templateName) {
    return (req, resp) => {
        resp.render(templateName, req.__pageContext);
    };
}

async function getAllPosts(req, _resp, next) {
    try {
        const postsList = await service.post.getAllPosts();

        req.__pageContext.postsList = postsList;

        next();
    } catch (error) {
        next(error);
    }
}

async function createNewPost(req, resp, next) {
    try {
        const { userId } = req.__pageContext;

        await service.post.createNewPost({ ...req.body, authorId: userId });

        resp.redirect(req.baseUrl);
    } catch (error) {
        next(error);
    }
}

async function getUserPosts(req, _resp, next) {
    try {
        const { userId } = req.__pageContext;

        const postsList = await service.post.getUserPosts(userId);
        req.__pageContext.postsList = postsList;

        next();
    } catch (error) {
        next(error);
    }
}

async function getPostById(req, _resp, next) {
    try {
        const { postId } = req.params;

        const post = await service.post.getPostById(postId);
        req.__pageContext.post = post;

        next();
    } catch (error) {
        next(error);
    }
}

async function createNewComment(req, resp, next) {
    try {
        const { userId } = req.__pageContext;

        await service.comment.createNewComment({ ...req.body, authorId: userId });

        resp.redirect("back");
    } catch (error) {
        next(error);
    }
}

async function getAllUsers(req, _resp, next) {
    try {
        const usersList = await service.user.getAllUsers();

        req.__pageContext.usersList = usersList;

        next();
    } catch (error) {
        next(error);
    }
}

async function getUserById(req, _resp, next) {
    try {
        const { userId } = req.params;

        const user = await service.user.getUserById(userId);
        req.__pageContext.user = user;

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addPageContext,
    renderPage,
    getAllPosts,
    getUserPosts,
    getPostById,
    createNewPost,
    createNewComment,
    checkAuth,
    getAllUsers,
    getUserById
    
};