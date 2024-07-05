const express = require("express");
const pagesRouter = express.Router();

const formDataParser = express.urlencoded({ extended: false });
const pagesController = require("../controllers/pages_controller");
const { logUserIn, signUserUp } = require("../controllers/auth_controller");
const { authIniteSessionAndRedirect, authDestroySessionAndRedirect, restrictResource, ROLES } = require("../middlewares/authContext");
const { ValidationError, AuthError, NotFoundError } = require("../errors");
const { userDataValidator, idValidator, postDataValidator, commentDataValidator } = require("../middlewares/validators");
const { fileParser } = require("../middlewares/fileParser");
const logger = require("../utils/logger")("pages router");


async function formErrorHandler(err, req, _resp, next) {
    if (err instanceof ValidationError || err instanceof AuthError) {
        logger.error(err.message, err);
    
        req.__pageContext = {
            ...req.__pageContext,
            data: req.body,
            errors: err.errors
        }

        delete req.__pageContext.data.password; 
        logger.info("Saved metadata in context:", req.__pageContext);

        return next();
    }

    next(err);
}

function notFoundItemErrorHandler(err, req, resp, next) {
    if (err instanceof NotFoundError) {
        logger.error(err.message);
        return resp.redirect(`${req.baseUrl}/404`);
    }

    next(err);
}

pagesRouter.use(pagesController.addPageContext);


pagesRouter.get("/",
    pagesController.getAllPosts,
    pagesController.renderPage("pages/index")
)

pagesRouter.route("/login")
    .get(pagesController.renderPage("pages/login"))
    .post(
        formDataParser,
        userDataValidator,
        logUserIn,
        authIniteSessionAndRedirect(),
        formErrorHandler,
        pagesController.renderPage("pages/login")
    )

pagesRouter.route("/signup")
    .get(pagesController.renderPage("pages/signup"))
    .post(
        formDataParser,
        userDataValidator,
        signUserUp,
        authIniteSessionAndRedirect(),
        formErrorHandler,
        pagesController.renderPage("pages/signup")
    )

pagesRouter.get("/logout", authDestroySessionAndRedirect())

pagesRouter.get("/my-posts",
    restrictResource([ROLES.admin, ROLES.user]),
    pagesController.checkAuth,
    pagesController.getUserPosts,
    pagesController.renderPage("pages/my-posts")
)

pagesRouter.get("/post-details/:postId",
    idValidator.postId,
    pagesController.getPostById,
    pagesController.renderPage("pages/post-details"),
    notFoundItemErrorHandler
)

pagesRouter.route("/add-post")
    .all(
        restrictResource([ROLES.admin, ROLES.user]),
        pagesController.checkAuth
    )
    .get(pagesController.renderPage("pages/add-post"))
    .post(
        fileParser.single("upload"),
        postDataValidator,
        pagesController.createNewPost,
        formErrorHandler,
        pagesController.renderPage("pages/add-post")
    )

pagesRouter.post("/add-comment",
    restrictResource([ROLES.admin, ROLES.user]),
    pagesController.checkAuth,
    formDataParser,
    commentDataValidator,
    pagesController.createNewComment,
    formErrorHandler
)

pagesRouter.route("/admin-page")
    .get(
        restrictResource([ROLES.admin]),
        pagesController.getAllUsers,
        pagesController.renderPage("pages/admin")
    )


pagesRouter.route("/user-details/:userId")
    .get(
        restrictResource([ROLES.admin]),
        idValidator.userId,
        pagesController.getUserById,
        pagesController.renderPage("pages/user-details"),
        notFoundItemErrorHandler
    )

pagesRouter.use(pagesController.renderPage("pages/404"));

pagesRouter.use((err, _req, resp, _next) => {
    logger.error("Unexpected server error", err);

    resp.render("pages/500");
});

module.exports = {
    pagesRouter
}