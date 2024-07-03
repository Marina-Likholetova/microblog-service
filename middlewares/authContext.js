const { session: sessionConfig } = require("config");
const logger = require("../utils/logger")("auth context");

const ROLES = {
    admin: 'admin',
    user: 'user'
}

function authIniteSessionAndRedirect(redirectTo) {
    return (req, resp) => {
        req.session.context = req.__authContext;

        logger.info(`Session for [${req.__authContext.role}] - [${req.__authContext.username}] successfully created!`);
        resp.redirect(redirectTo || req.baseUrl);
    };
}

function authDestroySessionAndRedirect(redirectTo) {
    return (req, resp) => {
        const { role, username } = req.session.context;

        req.session.destroy(() => {
            resp.clearCookie(sessionConfig.cookieName);

            logger.info(`Session for [${role}] - [${username}] terminated!`);
            resp.redirect(redirectTo || req.baseUrl);
        })
    }
}

function restrictResource(permittedForRoles = []) {
    return (req, resp, next) => {
        const { role = "unauthorized" } = req.session?.context || {};

        if (permittedForRoles.includes(role)) {
            return next()
        }

        logger.info(`Resource access for [${role}] denied!`)
        resp.redirect(`${req.baseUrl}/login`);
    }
}

module.exports = {
    authIniteSessionAndRedirect,
    authDestroySessionAndRedirect,
    restrictResource,
    ROLES
};