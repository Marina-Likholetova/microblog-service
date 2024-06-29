const express = require("express");
const pagesRouter = express.Router();

const formDataParser = express.urlencoded({ extended: false });
const pagesController = require("../controllers/pages_controller");
const { logUserIn, signUserUp } = require("../controllers/auth_controller");
const { authIniteSessionAndRedirect, authDestroySessionAndRedirect, restrictResource, ROLES } = require("../middlewares/authContext");
const { ValidationError, AuthError } = require("../errors");
const { userDataValidator, idValidator, postDataValidator, commentDataValidator } = require("../middlewares/validators");


async function formErrorHandler(err, req, _resp, next) {
    if (err instanceof ValidationError || err instanceof AuthError) {
    
        req.__pageContext = {
            ...req.__pageContext,
            data: req.body,
            errors: err.errors
        }

        delete req.__pageContext.data.password; 

        return next();
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
    pagesController.renderPage("pages/post-details")
)

pagesRouter.route("/add-post")
    .all(
        restrictResource([ROLES.admin, ROLES.user]),
        pagesController.checkAuth
    )
    .get(pagesController.renderPage("pages/add-post"))
    .post(
        formDataParser,
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
    formErrorHandler,
    (_req, resp, _next) => {
        resp.redirect("back")
    }
)

pagesRouter.use(pagesController.renderPage("pages/404"));

pagesRouter.use((err, _req, resp, _next) => {
    resp.render("pages/500");
});

module.exports = {
    pagesRouter
}